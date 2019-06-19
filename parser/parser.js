const {
  TokenType,
  validateType
} = require('../scanner/token.js')
const {
  ModuleStmt,
  FunctionStmt,
  ExpressionStmt,
  ReturnStmt
} = require('../nodes/statement.js')
const {
  BinaryExpr,
  LiteralExpr
} = require('../nodes/expression.js')

class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.current = 0
    this.hasError = false
  }

  parse() {
    const statements = []

    while(!this.isAtEnd()) {
      if (this.match(TokenType.LineBreak)) {
        continue
      }
      statements.push(this.declaration())
    }

    return statements
  }

  declaration() {
    if (this.match(TokenType.Module)) {
      return this.module()
    } else if (this.match(TokenType.Fn)) {
      return this.function('function')
    } else {
      return this.statement()
    }
  }

  module() {
    const name = this.consume(TokenType.Identifier, 'Expected module name.')
    return new ModuleStmt(name)
  }

  function(type) {
    const name = this.consume(TokenType.Identifier, `Expected ${type} name.`)
    this.consume(TokenType.LeftParen, 'Expected \'(\' after function name')
    this.consume(TokenType.RightParen, 'Expected \')\' after function name')
    this.consume(TokenType.LeftBrace, 'Expected \'(\' after function name')
    const body = this.block()
    return new FunctionStmt(name, [], body)
  }

  block() {
    const statements = []

    while (!this.check(TokenType.RightBrace) && !this.isAtEnd()) {
      if (this.match(TokenType.LineBreak)) {
        continue
      }
      statements.push(this.statement())
    }

    this.consume(TokenType.RightBrace, 'Expected \'}\' after block.')

    return statements
  }

  statement() {
    if (this.match(TokenType.Return)) {
      return this.returnStatment()
    }
    return this.expressionStatement()
  }

  returnStatment() {
    const keyword = this.previous()
    let value

    if (!this.isAtEnd() || !this.match(TokenType.LineBreak)) {
      value = this.expression()
    }

    return new ReturnStmt(keyword, value)
  }

  expressionStatement() {
    const expression = this.expression()
    return new ExpressionStmt(expression)
  }

  expression() {
    return this.binary()
  }

  binary() {
    const left = this.primary()

    if (this.match(TokenType.Plus, TokenType.Minus)) {
      const op = this.previous()
      const right = this.primary()
      return new BinaryExpr(left, op, right)
    }

    return left
  }

  primary() {
    if (this.match(TokenType.Int, TokenType.Float)) {
      return new LiteralExpr(this.previous().literal)
    }

    this.error(this.peek(), 'Expected expression.')
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF
  }

  peek() {
    return this.tokens[this.current]
  }

  match(...types) {
    for (let i = 0; i < types.length; i++) {
      if (this.check(types[i])) {
        this.advance()
        return true
      }
    }
    return false
  }

  check(type) {
    validateType(type)
    if (this.isAtEnd()) {
      return false
    }
    return this.peek().type === type
  }

  consume(type, message) {
    if (this.check(type)) {
      return this.advance()
    }
    this.error(this.peek(), message)
  }

  advance() {
    if (!this.isAtEnd()) {
      this.current++
    }
    return this.previous()
  }

  previous() {
    return this.tokens[this.current - 1]
  }

  error(token, message) {
    if (token.type === TokenType.EOF) {
      this.report(token.line, 'at end', message)
    } else {
      this.report(token.line, `at '${token.source}'`, message)
    }
  }

  report(line, where, message) {
    console.trace(`[line ${line}] Error ${where} : ${message}`)
    this.hasError = true
  }
}
module.exports = Parser