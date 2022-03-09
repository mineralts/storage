/*
 * packages/MakeCommand.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { Application, ForgeCommand } from '@mineralts/core-preview'
import Storage from '../Storage'

export default class DatabaseSync extends ForgeCommand {
  public static commandName = 'database:sync'
  public static description = 'Synchronise the database with the models'

  public static settings = {
    loadApp: true
  }

  public async run (...args): Promise<void> {
    const kernel = Application.singleton().resolveBinding('Mineral/Core/kernel')
    await kernel.bootProviders()

    const storage = Application.singleton().resolveBinding('Mineral/Modules/Storage') as Storage

    const options = {
      force: args.includes('--force') || false,
      alter: args.includes('--alter') || false,
    }

    await storage.sequelize.sync(options)
    this.logger.info('The database has been synchronised with models.')
  }
}