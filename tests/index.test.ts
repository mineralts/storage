import { describe, expect, test } from 'vitest'
import { Sequelize } from 'sequelize'
import Foo from '../mock/Foo'

describe('Test', async () => {
  const sequelize = new Sequelize('sqlite::memory')

  test('Authentication', async () => {
    let isAuthentication: boolean | null

    try {
      await sequelize.authenticate()
      isAuthentication = true
    } catch (error) {
      isAuthentication = false
    }

    expect(isAuthentication).toBe(true)
  })

  test('Create Foo model', async () => {
    Foo.init((Foo as any).databaseSchema, {
      sequelize: sequelize,
      modelName: Foo.name.toLowerCase(),
      timestamps: true,
      createdAt: true
    })

    await sequelize.sync({ alter: true })
  })

  test('Cannot find resource if doesn\'t exist', async () => {
    const foo = await Foo.findOne({ where: { username: 'Foo' } })
    expect(foo).toBeNull()
  })

  test('Create one resource', async () => {
    const foo = await Foo.create({ username: 'Foo' })
    expect(foo).toMatchObject({ id: 1, username: 'Foo' })
  })

  test('Find for one resource if it exists', async () => {
    const foo = await Foo.findOne({ where: { username: 'Foo' } })
    expect(foo).toMatchObject({ id: 1, username: 'Foo' })
  })

  test('Update one resource if it exists', async () => {
    const foo = await Foo.findOne({ where: { username: 'Foo' } })
    const result = await foo?.update({ username: 'Foo2' })

    expect(result).toMatchObject({ id: 1, username: 'Foo2' })
  })

  test('Delete one resource if it exists', async () => {
    const foo = await Foo.findOne({ where: { username: 'Foo2' } })
    await foo?.destroy()

    const old = await Foo.findOne({ where: { username: 'Foo2' } })

    expect(old).toBeNull()
  })
})
