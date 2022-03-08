import Storage from '../Storage'

export interface ServiceContract {
  'Mineral/Modules/Storage': Storage
}

export type DatabaseDriver = 'sqlite' | 'postgres'

export interface DatabaseConfig {
  connection: DatabaseDriver
  connections: {
    sqlite: {
      client: DatabaseDriver
      databaseLocation: string
    }
  }
}