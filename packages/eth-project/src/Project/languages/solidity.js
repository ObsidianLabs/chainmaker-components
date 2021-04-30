import * as monaco from 'monaco-editor'
import { registerRulesForLanguage } from 'monaco-ace-tokenizer'
import { BaseProjectManager } from '@obsidians/workspace'

import SolidityHighlightRules from './SolidityHighlightRules'

export default function () {
  monaco.languages.register({
    id: 'solidity'
  })
  registerRulesForLanguage('solidity', new SolidityHighlightRules())

  monaco.languages.registerDocumentFormattingEditProvider('solidity', {
    async provideDocumentFormattingEdits (model) {
      const code = model.getValue()

      const formatted = await BaseProjectManager.channel.invoke('formatSolidity', code)

      return [{
        range: model.getFullModelRange(),
        text: formatted,
      }]
    },
  })
}