import { Model, increment, column, DataTypes, MineralModel, ManyToMany, CreationOptional, InferAttributes, InferCreationAttributes, manyToMany, HasManyAddRelations } from '../src'
import Bar from './Bar'

@Model()
export default class Foo extends MineralModel<InferAttributes<Foo>, InferCreationAttributes<Foo>> {
  @increment({ type: DataTypes.INTEGER, autoIncrement: true })
  declare id: CreationOptional<number>

  @column({ type: DataTypes.STRING })
  declare username: string

  @manyToMany(() => Bar)
  declare bars: ManyToMany<Bar>

  declare addBars: HasManyAddRelations<Foo>
}