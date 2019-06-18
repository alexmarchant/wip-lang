import Token, { TokenType, Keywords } from './token.js';

export default class Scanner {
  constructor(source) {
    this.source = source
    this.current = 0
    this.start = 0
    this.line = 0
    this.tokens = []
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }

    const eof = new Token(
      TokenType.EOF,
      '',
      this.line,
      null
    )
    this.tokens.push(eof)
    return this.tokens
  }

  scanToken() {
    const char = this.advance()
    switch (char) {
      case '(':
        return this.addToken(TokenType.LeftParen)
      case ')':
        return this.addToken(TokenType.RightParen)
      case '{':
        return this.addToken(TokenType.LeftBrace)
      case '}':
        return this.addToken(TokenType.RightBrace)
      case ' ':
      case '\r':
      case '\t':
        return
      case '\n':
        this.line++
        return this.addToken(TokenType.LineBreak)
      default:
        if (this.isDigit(char)) {
          this.number()
        } else if (this.isAlpha(char)) {
          this.identifier()
        } else {
          console.log(this)
          throw new Error(`Unexpected char: ${this.line}`)
        }
    }
  }

  isAtEnd() {
    return this.current >= this.source.length
  }

  advance() {
    this.current++
    return this.source[this.current - 1]
  }

  addToken(type) {
    this.addTokenValue(type, null)
  }

  addTokenValue(type, value) {
    const source = this.source.slice(this.start, this.current)
    this.tokens.push(new Token(
      type,
      source,
      this.line,
      value
    ))
  }

  isDigit(char) {
    return char.match(/[0-9]/)
  }

  isAlpha(char) {
    return char.match(/[a-zA-Z_]/)
  }

  isAlphaNumeric(char) {
    return this.isDigit(char) || this.isAlpha(char)
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance()
    }

    const source = this.source.slice(this.start, this.current)
    const keyword = Keywords[source]
    if (keyword) {
      this.addToken(keyword)
    } else {
      this.addToken(TokenType.Identifier)
    }
  }

  number(char) {
    throw new Error('TODO')
  }

  peek() {
    if (this.isAtEnd()) {
      return String.fromCharCode(0)
    }
    return this.source[this.current]
  }
}