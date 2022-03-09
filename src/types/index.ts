import Storage from '../Storage'
import { Model as MineralModel } from 'sequelize/types/model'
import {
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  NonAttribute
} from 'sequelize'

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

export type ManyToMany<M extends MineralModel> = NonAttribute<M[]>
export type HasManyGetRelation<M extends MineralModel> = HasManyGetAssociationsMixin<M>
export type HasManyAddRelation<M extends MineralModel> = HasManyAddAssociationMixin<M, number>;
export type HasManyAddRelations<M extends MineralModel> = HasManyAddAssociationsMixin<M, number>;
export type HasManySetRelations<M extends MineralModel> = HasManySetAssociationsMixin<M, number>;
export type HasManyRemoveRelation<M extends MineralModel> = HasManyRemoveAssociationMixin<M, number>;
export type HasManyRemoveRelations<M extends MineralModel> = HasManyRemoveAssociationsMixin<M, number>;
export type HasManyHasRelation<M extends MineralModel> = HasManyHasAssociationMixin<M, number>;
export type HasManyHasRelations<M extends MineralModel> = HasManyHasAssociationsMixin<M, number>;
export type HasManyCountRelations = HasManyCountAssociationsMixin;
export type HasManyCreateRelation<M extends MineralModel> = HasManyCreateAssociationMixin<M, 'ownerId'>;