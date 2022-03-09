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

export default class DatabaseDrop extends ForgeCommand {
  public static commandName = 'database:drop'
  public static description = 'Synchronise the database with the models'

  public static settings = {
    loadApp: true
  }

  public async run (): Promise<void> {
    const kernel = Application.singleton().resolveBinding('Mineral/Core/kernel')
    await kernel.bootProviders()

    const storage = Application.singleton().resolveBinding('Mineral/Modules/Storage') as Storage

    try {
      await storage.sequelize.drop({ cascade: true })
      this.logger.info('The database has been drop.')
    } catch (error) {
      this.logger.info('An error has occurred.')
    }
  }
}