import { MineralPlugin } from '@mineralts/core-preview'
import { join } from 'node:path'
import fs from 'node:fs/promises'

export default class Instruction extends MineralPlugin {
  public async configure (): Promise<void> {
    const environment = this.ioc.resolveBinding('Mineral/Core/Environment')
    const root = environment.resolveKey('root')

    await this.alterRcFile(root)
    await this.writeConfig(root)
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
  }

  protected async writeConfig (root) {
    const configLocation = join(root, 'config', 'database.ts')
    const template = await fs.readFile(join(__dirname, '..', 'templates', 'database.txt'))

    await fs.writeFile(configLocation, template)
  }
}