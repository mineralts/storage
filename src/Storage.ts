import { Application } from '@mineralts/core-preview'
import { Sequelize } from 'sequelize'
import { join } from 'node:path'
import { DatabaseConfig } from './types'

export default class Storage {
  private sequelize!: Sequelize
  private environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
  private logger = Application.singleton().resolveBinding('Mineral/Core/Logger')

  public async initialize () {
    const root = this.environment.resolveKey('root')
    const location = join(root!, 'config', 'database.ts')

    const { default: databaseConfig }: { default: DatabaseConfig } = await import(location)
    const { connection: driver, connections } = databaseConfig

    const drivers = {
      sqlite: () => this.initializeSqlite(connections.sqlite),
    }

    driver in drivers
      ? drivers[databaseConfig.connection]()
      : this.unknownDriver(driver)

    if (this.environment.resolveKey('debug')) {
      await this.debug(driver)
    }
  }

  private initializeSqlite (driverConfig) {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: driverConfig.databaseLocation,
      logging: false
    })
  }

  protected unknownDriver (driver: string) {
    this.logger.fatal(`The ${driver} driver does not exist or is not recognised.`)
  }

  private async debug (driver: string) {
    try {
      await this.sequelize.authenticate()
      this.logger.info(`[${driver.toUpperCase()}] Database connection has been established successfully.`)
    } catch (error) {
      this.logger.fatal('Unable to connect to the database : ', error)
    }
  }
}