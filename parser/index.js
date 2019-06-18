import { TokenType } from '../scanner/token.js';
import { Module, Function } from './statement.js'

export default class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.current = 0
  }

  parse() {
    const statements = []

    while(!this.isAtEnd()) {
      if (this.peek().type === TokenType.LineBreak) {
        this.advance()
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
      throw new Error(`Unknown statement: ${JSON.stringify(this.peek())}`)
    }
  }

  module() {
    const name = this.consume(TokenType.Identifier)
    return new Module(name)
  }

  function(type) {
    const name = this.consume(TokenType.Identifier)
    this.consume(TokenType.LeftParen)
    this.consume(TokenType.RightParen)
    this.consume(TokenType.LeftBrace)
    const body = this.block()
    return new Function(name, [], body)
  }

  block() {
    const statements = []

    while (!this.check(TokenType.RightBrace) && !this.isAtEnd()) {
      if (this.peek().type === TokenType.LineBreak) {
        this.advance()
        continue
      }
      statements.push(this.declaration())
    }

    this.consume(TokenType.RightBrace)

    return statements
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF
  }

  peek() {
    return this.tokens[this.current]
  }

  match(type) {
    if (this.check(type)) {
      this.advance()
      return true
    }
    return false
  }

  check(type) {
    if (this.isAtEnd()) {
      return false
    }
    return this.peek().type === type
  }

  consume(type) {
    if (this.check(type)) {
      return this.advance()
    }
    throw new Error(`Expected type ${type}, got type ${this.peek().type}`)
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

  skipLineBreaks() {

  }
}