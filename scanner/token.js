export const TokenType = {
  LeftBrace: 'LeftBrace',
  RightBrace: 'RightBrace',
  LeftParen: 'LeftParen',
  RightParen: 'RightParen',
  Identifier: 'Identifier',
  LineBreak: 'LineBreak',
  Module: 'Module',
  Fn: 'Fn',
  EOF: 'EOF'
}

export const Keywords = {
  module: TokenType.Module,
  fn: TokenType.Fn,
}

export default class Token {
  constructor(type, source, line, value) {
    this.type = type
    this.source = source
    this.line = line
    this.literal = value
  }
}