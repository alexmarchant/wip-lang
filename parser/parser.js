const {
  TokenType,
  validateType,
} = require('../scanner/token.js')
const {
  ModuleStmt,
  FunctionStmt,
  ExpressionStmt,
  ReturnStmt,
} = require('../nodes/statement.js')
const {
  BinaryExpr,
  LiteralExpr,
  CallExpr,
  VarExpr,
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

    if (!this.isAtEnd() && !this.match(TokenType.LineBreak)) {
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
    const left = this.callExpr()

    if (this.match(TokenType.Plus, TokenType.Minus)) {
      const op = this.previous()
      const right = this.callExpr()
      return new BinaryExpr(left, op, right)
    }

    return left
  }

  callExpr() {
    let expr = this.primary()

    if (this.match(TokenType.LeftParen)) {
      expr = this.finishCall(expr)
    }

    return expr
  }

  finishCall(callee) {
    // Build args
    const args = []
    if (!this.check(TokenType.RightParen)) {
      while(true) {
        const expr = this.expression()
        args.push(expr)
        if (!this.match(TokenType.Comma)) {
          break
        }
      }
    }
  
    // Check for closing paren
    const paren = this.consume(TokenType.RightParen, "Expect ')' after arguments.")
  
    return new CallExpr(
      callee,
      paren,
      args,
    )
  }

  primary() {
    if (this.match(TokenType.Int, TokenType.Float, TokenType.String)) {
      return new LiteralExpr(this.previous().literal)
    }
    if (this.match(TokenType.Identifier)) {
      return new VarExpr(this.previous())
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
      const type = types[i]
      validateType(type)

      if (this.check(type)) {
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
      this.report(token.line, `at ${JSON.stringify(token.source)}`, message)
    }
  }

  report(line, where, message) {
    console.trace(`[line ${line}] Error ${where} : ${message}`)
    this.hasError = true
  }
}
module.exports = Parser