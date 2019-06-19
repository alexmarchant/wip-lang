const Scanner = require('../scanner/scanner.js')
const Parser = require('./parser.js')
const {
  ModuleStmt,
  FunctionStmt,
  ExpressionStmt,
  ReturnStmt
} = require('./statement.js')
const {
  LiteralExpr,
  BinaryExpr
} = require('./expression.js')

describe('Parser', () => {
  describe('statements', () => {
    test('ModuleStmt', () => {
      const tokens = new Scanner('module main').scanTokens()
      const statements = new Parser(tokens).parse()
      expect(statements[0]).toBeInstanceOf(ModuleStmt)
      expect(statements[0].name.source).toBe('main')
    })

    test('FunctionStmt', () => {
      const tokens = new Scanner('fn main() {}').scanTokens()
      const statements = new Parser(tokens).parse()
      expect(statements[0]).toBeInstanceOf(FunctionStmt)
      expect(statements[0].name.source).toBe('main')
    })

    test('ExpressionStmt', () => {
      const tokens = new Scanner('1 + 1').scanTokens()
      const statements = new Parser(tokens).parse()
      expect(statements[0]).toBeInstanceOf(ExpressionStmt)
      expect(statements[0].expression).toBeTruthy()
    })
 
    test('ReturnStmt', () => {
      const tokens = new Scanner('return 1').scanTokens()
      const statements = new Parser(tokens).parse()
      expect(statements[0]).toBeInstanceOf(ReturnStmt)
      expect(statements[0].value).toBeTruthy()
    })
  })

  describe('expressions', () => {
    test('LiteralExpr', () => {
      const tokens = new Scanner('1').scanTokens()
      const statements = new Parser(tokens).parse()
      const expression = statements[0].expression
      expect(expression).toBeInstanceOf(LiteralExpr)
      expect(expression.value).toBe(1)
    })

    test('BinaryExpr', () => {
      const tokens = new Scanner('1 + 1').scanTokens()
      const statements = new Parser(tokens).parse()
      const expression = statements[0].expression
      expect(expression).toBeInstanceOf(BinaryExpr)
      expect(expression.left).toBeTruthy()
      expect(expression.operator.source).toBe('+')
      expect(expression.right).toBeTruthy()
    })
  })
})