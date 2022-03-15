import { MineralModule } from '@mineralts/core-preview'
import { join } from 'node:path'
import fs from 'node:fs/promises'
import { EOL } from 'os'

export default class Instruction extends MineralModule {
  public async configure (): Promise<void> {
    const environment = this.ioc.resolveBinding('Mineral/Core/Environment')
    const root = environment.resolveKey('APP_ROOT')

    const database = await this.prompt.select('Which database do you want to use ?', {
      choices: ['Postgres', 'MySql', 'MariaDB', 'Sqlite'],
      multiple: false
    })

    await this.alterEnvironment(root, database)
    await this.writeConfig(root)
    await this.alterRcFile(root)

    await this.generateManifest()

    this.logger.info('Configuration of the @mineralts/storage-preview module was successfully')
  }

  protected async alterRcFile (root) {
    const moduleName: string = '@mineralts/storage-preview'
    const rcFileLocation = join(root, '.mineralrc.json')

    const { default: rcFile } = await import(rcFileLocation)
    if (!rcFile.providers) {
      rcFile.providers = []
    }

    if (!rcFile.commands) {
      rcFile.commands = []
    }

    if (!rcFile.providers.includes(moduleName)) {
      rcFile.providers.push(moduleName)
      rcFile.commands.push(moduleName)

      await fs.writeFile(
        rcFileLocation,
        JSON.stringify(rcFile, null, 2)
      )
    }

    const environment = this.ioc.resolveBinding('Mineral/Core/Environment')
    const rcfile = environment.loadFileSync(root!, '.mineralrc.json', 'The .mineralrc.json file was not found at the root of the project.')
    environment.registerKey('RC_FILE', rcfile)
  }

  protected async alterEnvironment (root, payload: string) {
    const environmentLocation = join(root, '.env')
    const environmentRaw: string = (await fs.readFile(environmentLocation, 'utf-8'))
    const environment = environmentRaw.split(EOL)
    const keepEnvironment = environment.filter((key: string) => !key.startsWith('DB_'))

    keepEnvironment.push(`DB_CONNECTION: ${payload.toLowerCase()}`)

    const environments = {
      sqlite: () => {
        keepEnvironment.push('DB_PATH: database.sqlite')
      },
      mariadb: () => {
        keepEnvironment.push('DB_HOST: localhost')
        keepEnvironment.push('DB_USER: root')
        keepEnvironment.push('DB_PASSWORD: root')
        keepEnvironment.push('DB_PORT: 3606')
        keepEnvironment.push('DB_NAME: mariadb')
      },
      postgres: () => {
        keepEnvironment.push('DB_HOST: localhost')
        keepEnvironment.push('DB_USER: postgres')
        keepEnvironment.push('DB_PASSWORD: postgres')
        keepEnvironment.push('DB_PORT: 5432')
        keepEnvironment.push('DB_NAME: postgres')
      }
    }

    if (payload.toLowerCase() in environments) {
      environments[payload.toLowerCase()]()
    }


    await fs.writeFile(environmentLocation, keepEnvironment.join(EOL))
  }

  protected async writeConfig (root) {
    const configLocation = join(root, 'config', 'database.ts')
    const template = await fs.readFile(join(__dirname, '..', 'templates', 'database.txt'))

    await fs.writeFile(configLocation, template)
  }

  private async generateManifest () {
    const cli = this.ioc.resolveBinding('Mineral/Core/Cli')
    const command = cli.resolveCommand('generate:manifest')

    await command.run()
  }
}