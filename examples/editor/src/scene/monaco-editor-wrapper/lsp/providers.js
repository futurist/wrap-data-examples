import {
  keywords
} from './keywords';

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

  provideCompletionItems(model, position, token, context) {

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
