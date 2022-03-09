# 📦 Storage Database

The Storage module is a module designed to fully exploit Sqlite, MySQL, MariaDB, PostgreSQL databases within your mineral applications.

## Installation
Install the module from the NPM registry
```bash
npm install @mineralts/storage-preview
# Or
yarn add @mineralts/storage-preview
```

Once installed, please configure the module with the following command and answer the questions asked
```bash
node forge configure @mineralts/storage-preview
```

Please install the drivers according to the type of database selected.

## Usage

Le module Storage Database est une abstraction de l'ORM Sequelize, veuillez vous référer à la [documentation](https://sequelize.org/master/index.html) de la librairie

Models are the essence of Storage Database.
A model is an abstraction that represents a table in your database. In Storage Database, it is a class that extends Model.

The model tells Storage Database several things about the entity it represents, such as the name of the table in the database and which columns it has (and their data types).

A model in Storage Database has a name.
This name does not have to be the same name of the table it represents in the database. Usually, models have singular names (such as User) while tables have pluralized names (such as Users), although this is fully configurable.

### Create basic model
```ts
import { Model, increment, column, DataTypes, MineralModel, ManyToMany, CreationOptional, InferAttributes, InferCreationAttributes, manyToMany, HasManyAddRelations } from '../src'

@Model()
export default class Foo extends MineralModel<InferAttributes<Foo>, InferCreationAttributes<Foo>> {
  @increment({ type: DataTypes.INTEGER, autoIncrement: true })
  declare id: CreationOptional<number>

  @column({ type: DataTypes.STRING })
  declare firstname: string

  @column({ type: DataTypes.STRING })
  declare lastname: string
}
```

The `@Model()` decorator tells the module that the class should be considered a database model.

By default, an auto incremented `id` column is present and must _always__ exist in each of your tables.

The `@column()` decorator tells the module that the given property will be a column with the options defined in it.

### Migrate your models to your database
Your templates alone are not enough, in fact you need to manually trigger their sending to the database with the command below.
```bash
node forge database:sync
```

You can add one of the following two options:

- `--force`: Removes all data from the database and recreates the database structure with your updated templates.
- `--alter`: Updates the existing without deleting anything (corresponds to `ALTER TABLE`)

### Drop database
```bash
node forge database:drop
```

## CRUD
### Store one resource
La création d'une resource est extrêmement simple, il vous suffit d'importer votre model et d'effectuer une action dessus.
```ts
import Foo from 'App/Models/Foo'

await Foo.create({
  firstname: 'Baptiste',
  lastname: 'Parmantier'
})
```

### Get one resource
```ts
import Foo from 'App/Models/Foo'

const foo: Foo = await Foo.findOne({ where: { firstname: 'Baptiste' } })
console.log(foo)
```

### Get all resources
```ts
import Foo from 'App/Models/Foo'

const foo: Foo[] = await Foo.findAll()
console.log(foo)
```

### Update one resource
```ts
import Foo from 'App/Models/Foo'

const foo: Foo = await Foo.findOne({ where: { firstname: 'Baptiste' } })
await foo.update({ firstname: 'Freeze' })
```

### Delete one resource
```ts
import Foo from 'App/Models/Foo'

const foo: Foo = await Foo.findOne({ where: { firstname: 'Baptiste' } })
await foo.destroy()
```