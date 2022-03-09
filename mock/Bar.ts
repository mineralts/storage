import {
  column,
  CreationOptional,
  DataTypes,
  increment,
  InferAttributes,
  InferCreationAttributes,
  MineralModel,
  Model
} from '../src'

@Model()
export default class Bar extends MineralModel<InferAttributes<Bar>, InferCreationAttributes<Bar>> {
  @increment({ type: DataTypes.INTEGER, autoIncrement: true })
  declare id: CreationOptional<number>

  @column({ type: DataTypes.STRING })
  declare username: string
}