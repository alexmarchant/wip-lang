const { Token, TokenType, Keywords } = require('./token.js');

class Scanner {
  constructor(source) {
    this.source = source
    this.current = 0
    this.start = 0
    this.line = 1
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
      case '+':
        return this.addToken(TokenType.Plus)
      case '-':
        return this.addToken(TokenType.Minus)
      case ',':
        return this.addToken(TokenType.Comma)
      case ' ':
      case '\r':
      case '\t':
        return
      case '\n':
        const token = this.addToken(TokenType.LineBreak)
        this.line++
        return token
      case '"':
        return this.string()
      default:
        if (this.isDigit(char)) {
          return this.number()
        } else if (this.isAlpha(char)) {
          return this.identifier()
        } else {
          throw new Error(`Unexpected char: ${char}`)
        }
    }
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
    const tokenType = Keywords[source]
    if (tokenType) {
      this.addToken(tokenType)
    } else {
      this.addToken(TokenType.Identifier)
    }
  }

  number(char) {
    let type = TokenType.Int

    // Start scanning
    while (this.isDigit(this.peek())) {
      this.advance()
    }
  
    // Its a float, scan past decimal
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      type = TokenType.Float
      this.advance()
  
      while (this.isDigit(this.peek())) {
        this.advance()
      }
    }
  
    // Parse value
    const source = this.source.slice(this.start, this.current)
    let value
    if (type === TokenType.Int) {
      value = parseInt(source, 10)
    } else {
      value = parseFloat(source)
    }
    this.addTokenValue(type, value)
  }

  peek() {
    if (this.isAtEnd()) {
      return String.fromCharCode(0)
    }
    return this.source[this.current]
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) {
      return String.fromCharCode(0)
    }
    return this.source[this.current + 1]
  }

  isAtEnd() {
    return this.current >= this.source.length
  }

  advance() {
    this.current++
    return this.source[this.current - 1]
  }
}
module.exports = Scanner
