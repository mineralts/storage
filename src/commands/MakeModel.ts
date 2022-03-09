/*
 * packages/MakeCommand.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import path from 'path'
import { prompt } from 'enquirer'
import { FileFactory, ForgeCommand } from '@mineralts/core-preview'

export default class MakeCommand extends ForgeCommand {
  public static commandName = 'make:model'
  public static description = 'Make a new model class'

  public static settings = {
    loadApp: false
  }

  public async run (): Promise<void> {
    const generator = new FileFactory(this.logger)
    await generator.loadFolders(path.join(process.cwd(), 'src'))

    const confirm = {
      type: 'confirm',
      name: 'confirm',
      message: 'Would you like to create a new folder ?',
    }

    const filename = {
      type: 'input',
      name: 'filename',
      message: 'Please define a name for your model'
    }

    try {
      const answers = await prompt([filename, confirm]) as { filename, confirm }
      generator.setFilename(answers.filename)

      answers.confirm
        ? await this.createLocation(generator)
        : await this.useLocation(generator)

      const templateLocation = path.join(__dirname, '..', '..', 'templates', 'model.txt')
      generator.setTemplate(templateLocation)

      await generator.write()
    } catch (err) {
      this.logger.error('Order has been cancelled.')
    }
  }

  protected async createLocation (generator: FileFactory) {
    const location = {
      type: 'input',
      name: 'location',
      message: 'Please define the location of your file',
      hint: 'App/Folder/SubFolder'
    }

    try {
      const answer = await prompt([location]) as { location: string }
      generator.setLocation(answer.location)

      await generator.buildFolders()
    } catch (err) {
      this.logger.error('Order has been cancelled.')
    }
  }

  protected async useLocation (generator: FileFactory) {
    const location = {
      type: 'autocomplete',
      name: 'location',
      message: 'Please define the location of your order',
      limit: 3,
      choices: generator.getFolders().length ? generator.getFolders() : ['App']
    }

    try {
      const answer = await prompt([location]) as { location: string }
      generator.setLocation(answer.location)
    } catch (err) {
      this.logger.error('Order has been cancelled.')
    }
  }
}