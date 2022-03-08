/*
 * packages/AppProvider.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { MineralProvider, Provider } from '@mineralts/core-preview'
import Storage from '../Storage'

@Provider()
export default class AppProvider extends MineralProvider {
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

  public async loadFile (file) {
  }

  public async ok () {
  }
}