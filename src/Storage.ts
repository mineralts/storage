import { Application } from '@mineralts/core-preview'
import { Sequelize } from 'sequelize'
import { join } from 'node:path'
import { DatabaseConfig } from './types'

export default class Storage {
  public sequelize!: Sequelize
  private environment = Application.singleton().resolveBinding('Mineral/Core/Environment')
  private logger = Application.singleton().resolveBinding('Mineral/Core/Logger')

  public async initialize () {
    const root = this.environment.resolveKey('APP_ROOT')
    const location = join(root!, 'config', 'database.ts')

    const { default: databaseConfig }: { default: DatabaseConfig } = await import(location)
    const { connection: driver, connections } = databaseConfig

    const drivers = {
      sqlite: () => this.initializeSqlite(connections.sqlite),
      postgres: () => this.initializePostgres(connections.postgres),
    }

    driver in drivers
      ? drivers[databaseConfig.connection]()
      : this.unknownDriver(driver)

    if (this.environment.resolveKey('APP_DEBUG')) {
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

  private initializePostgres (driverConfig) {
    this.sequelize = new Sequelize(driverConfig.database, driverConfig.user, driverConfig.password, {
      dialect: 'postgres',
      port: driverConfig.port,
      logging: false,
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

  public registerModel (model, payload) {
    console.log(model, payload)
    model.init({})
  }
}