/*
 * packages/AppProvider.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { Entity, MineralProvider, Provider } from '@mineralts/core-preview'
import Storage from '../Storage'
import { Model, ModelStatic } from 'sequelize'

@Provider()
export default class StorageProvider extends MineralProvider {
  public async boot () {
    const environment = this.application.resolveBinding('Mineral/Core/Environment')
    const debug = environment.resolveKey('debug')

    if (debug) {
      this.logger.info('The Storage module is initialized.')
    }

    const storage = new Storage()
    await storage.initialize()

    this.application.registerBinding('Mineral/Modules/Storage', storage)
  }

  public async loadFile (file: Entity) {
    const helper = this.application.resolveBinding('Mineral/Core/Helpers')
    const storage = this.application.resolveBinding('Mineral/Modules/Storage') as Storage

    if (file.source.identifier == 'storage-model') {
      const model = file.source
      model.init(model.databaseSchema, {
        sequelize: storage.sequelize,
        modelName: helper.snakeCase(model.name),
        timestamps: true,
        createdAt: true,
      })

      Object.entries(model.relations).forEach(([, payload]: [string, any]) => {
        const relatedModel = payload.relatedModel() as ModelStatic<Model>
        const foreignKey = helper.camelCase(helper.singularize(`${model.name}Id`))
        const pivotTableName = helper.snakeCase(helper.singularize(`${model.name}_${payload.relatedModel().name}`))

        const relations = {
          hasOne: () => { model.hasOne(relatedModel, { foreignKey })  },
          hasMany: () => { model.hasMany(relatedModel, { foreignKey }) },
          belongTo: () => { relatedModel.belongsTo(model) },
          manyToMany: () => {
            model.belongsToMany(payload.relatedModel(), {
              through: pivotTableName,
              foreignKey,
              onDelete: payload.onDelete || 'SET NULL',
              onUpdate: payload.onUpdate || 'SET NULL'
            })
          }
        }

        if (payload.relationType in relations) {
          relations[payload.relationType]()
        }
      })
    }
  }

  public async ok () {
  }
}