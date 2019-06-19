const TokenType = {
  LeftBrace: 'LeftBrace',
  RightBrace: 'RightBrace',
  LeftParen: 'LeftParen',
  RightParen: 'RightParen',
  Identifier: 'Identifier',
  LineBreak: 'LineBreak',
  Return: 'Return',
  Module: 'Module',
  Plus: 'Plus',
  Minus: 'Minus',
  Int: 'Int',
  Float: 'Float',
  Fn: 'Fn',
  EOF: 'EOF'
}
exports.TokenType = TokenType

const Keywords = {
  module: TokenType.Module,
  fn: TokenType.Fn,
  return: TokenType.Return,
}
exports.Keywords = Keywords

function validateType(type) {
  if (!type in TokenType) {
    throw new Error(`Invalid TokenType: ${type}`)
  }
}
exports.validateType = validateType

class Token {
  constructor(type, source, line, value) {
    validateType(type)
    this.type = type
    this.source = source
    this.line = line
    this.literal = value
  }
}
exports.Token = Token