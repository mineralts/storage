import { DataType, DataTypes, Model as MineralModel, ModelStatic, Validator } from 'sequelize'

export function Model () {
  return (target: any) => {
    target.identifier = 'storage-model'
    target.databaseSchema = target.prototype.databaseSchema || {}
    target.relations = target.prototype.relations || {}
  }
}

export function increment (options: { type: DataType, autoIncrement: boolean }) {
  return (target, propertyKey: string) => {
    const classPrototype = target.constructor.prototype
    if (!classPrototype.databaseSchema) {
      classPrototype['databaseSchema'] = {}
    }

    classPrototype.databaseSchema = {
      ...classPrototype.databaseSchema,
      [propertyKey]: {
        type: options.type,
        autoIncrement: options.autoIncrement,
        primaryKey: true
      }
    }
  }
}

export function column (options: { type: DataType, primary?: boolean, nullable?: boolean, unique?: boolean, validate?: Validator }) {
  return (target, propertyKey: string) => {
    const classPrototype = target.constructor.prototype
    if (!classPrototype.databaseSchema) {
      classPrototype['databaseSchema'] = {}
    }

    classPrototype.databaseSchema = {
      ...classPrototype.databaseSchema,
      [propertyKey]: {
        type: options.type,
        primary: options.primary || false,
        nullable: options.nullable || false,
        unique: options.unique || false,
        validate: options.validate || {}
      }
    }
  }
}

export function hasOne<M extends MineralModel> (relatedModel: () => ModelStatic<M>, options: { type?: DataTypes.DataType, foreignKey?: string } = {}) {
  return (target, propertyKey: string) => {
    const classPrototype = target.constructor.prototype
    if (!classPrototype.relations) {
      classPrototype['relations'] = {}
    }

    const optionsBuilder = {
      ...'type' in options && { type: options!.type },
      ...'foreignKey' in options && { foreignKey: options!.foreignKey },
    }

    classPrototype.relations = {
      ...classPrototype.relations,
      [propertyKey]: {
        relationType: 'hasOne',
        relatedModel,
        options: optionsBuilder
      }
    }
  }
}

export function hasMany<M extends MineralModel> (relatedModel: () => ModelStatic<M>, options: { type?: DataTypes.DataType, foreignKey?: string } = {}) {
  return (target, propertyKey: string) => {
    const classPrototype = target.constructor.prototype
    if (!classPrototype.relations) {
      classPrototype['relations'] = {}
    }

    const optionsBuilder = {
      ...'type' in options && { type: options!.type },
      ...'foreignKey' in options && { foreignKey: options!.foreignKey },
    }

    classPrototype.relations = {
      ...classPrototype.relations,
      [propertyKey]: {
        relationType: 'hasMany',
        relatedModel,
        options: optionsBuilder
      }
    }
  }
}

export function belongTo<M extends MineralModel> (relatedModel: () => ModelStatic<M>, options: { type?: DataTypes.DataType, foreignKey?: string } = {}) {
  return (target, propertyKey: string) => {
    const classPrototype = target.constructor.prototype
    if (!classPrototype.relations) {
      classPrototype['relations'] = {}
    }

    const optionsBuilder = {
      ...'type' in options && { type: options!.type },
      ...'foreignKey' in options && { foreignKey: options!.foreignKey },
    }

    classPrototype.relations = {
      ...classPrototype.relations,
      [propertyKey]: {
        relationType: 'belongTo',
        relatedModel,
        options: optionsBuilder
      }
    }
  }
}

type RelationAction = 'RESTRICT' | 'CASCADE' | 'NO ACTION' | 'SET DEFAULT' | 'SET NULL'

export function manyToMany<M extends MineralModel> (relatedModel: () => ModelStatic<M>, options?: { foreignKey?: string, onDelete?: RelationAction, onUpdate?: RelationAction }) {
  return (target, propertyKey: string): any => {
    const classPrototype = target.constructor.prototype
    if (!classPrototype.relations) {
      classPrototype['relations'] = {}
    }

    classPrototype.relations = {
      ...classPrototype.relations,
      [propertyKey]: {
        relationType: 'manyToMany',
        relatedModel,
        options: options ?
          {
            ...'foreignKey' in options && { foreignKey: options!.foreignKey },
            ...'onDelete' in options && { onDelete: options!.onDelete },
            ...'onUpdate' in options && { onDelete: options!.onUpdate },
          }
          : {}
      }
    }
  }
}