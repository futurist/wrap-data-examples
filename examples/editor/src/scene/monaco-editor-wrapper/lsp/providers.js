import {
  conf,
  language
} from 'monaco-languages/release/esm/mysql/mysql'

import {
  CompletionItemKind
} from './def';

class CompletionItem {
  constructor(label, kind, insertText) {
    return {
      label,
      kind,
      insertText: label
    }
  }
}

export class CompletionProvider {

  constructor(options) {
    this.options = options || {};
  }

  get triggerCharacters() {
    return ['.', '"', ' '];
  }

  provideCompletionItems(model, position, token, context) {
    console.log(model, position, token, context)
    const {
      _tokens
    } = model
    const {
      lineNumber,
      column
    } = position
    const keywords = language.keywords
      .concat(language.operators)
      // .concat(language.builtinFunctions)
      // .concat(language.builtinVariables)

    console.log(column)
    if (column > 5) {
      // model.getLineTokens(lineNumber, /*inaccurateTokensAcceptable*/false);
      const state = _tokens._getState(lineNumber - 1);
      const lineContent = model.getLineContent(lineNumber);
      const {
        tokens
      } = _tokens.tokenizationSupport.tokenize(lineContent, state, 0) || {}
      console.log(tokens);
      /**
       * INPUT:  SELECT * from "user";
       * tokens: [{"offset":0,"type":"white.sql","language":"mysql"},{"offset":1,"type":"keyword.sql","language":"mysql"},{"offset":7,"type":"white.sql","language":"mysql"},{"offset":8,"type":"operator.sql","language":"mysql"},{"offset":9,"type":"white.sql","language":"mysql"},{"offset":10,"type":"keyword.sql","language":"mysql"},{"offset":14,"type":"white.sql","language":"mysql"},{"offset":15,"type":"string.double.sql","language":"mysql"},{"offset":21,"type":"identifier.sql","language":"mysql"},{"offset":22,"type":"delimiter.sql","language":"mysql"},{"offset":23,"type":"white.sql","language":"mysql"}]
       */
      if (tokens) {
        const index = column - 1
        const pos = tokens.findIndex(x => x.offset >= index)
        const curToken = tokens[pos]
        console.log('curToken', curToken)
        const arr = tokens.slice(0, pos>>>0)
        let item, nextItem = curToken
        while (item = arr.pop()) {
          if (!/white/.test(item.type)) break
          nextItem = item
        }
        if (item) {
          const nextOffset = nextItem ? nextItem.offset : lineContent.length
          const tokenText = lineContent.slice(item.offset, nextOffset)
          console.log(1234, item, tokenText)
          if (/keyword/.test(item.type) && /select|update|delete|from/i.test(tokenText)) {
            console.log(item, nextItem, tokenText)
            return [
              'User',
              'Cars',
              'Company',
            ].map(x => new KeywordCompletionItem(x))
          } else if (tokenText == '.') {
            return [
              'id',
              'name',
              'age',
            ].map(x => new KeywordCompletionItem(x))
          }
        }
      }
      return new Promise((res) => {
        setTimeout(() => res(
          keywords.map(word => new KeywordCompletionItem(word))
        ), 1000)
      })
    }
    let items = this.getCompletionItems(keywords);
    return items;
  }

  getCompletionItems(keywords) {
    let items = keywords.map(word => new KeywordCompletionItem(word));
    return items;
  }
}

class KeywordCompletionItem extends CompletionItem {
  constructor(keyword) {
    super(keyword, CompletionItemKind.Keyword);
  }
}

class TableCompletionItem extends CompletionItem {
  constructor(name) {
    super(name, CompletionItemKind.File);
  }
}

class ColumnCompletionItem extends CompletionItem {
  constructor(name) {
    super(name, CompletionItemKind.Field);
  }
}
