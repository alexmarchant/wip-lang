const FunctionType = {
  Function: 'Function'
}
exports.FunctionType = FunctionType

class Statement {
  accept(visitor) {
    throw new Error('Abstract method not implemented')
  }
}
exports.Statement = Statement

class ModuleStmt extends Statement {
  constructor(name) {
    super()
    this.name = name
  }

  accept(visitor) {
    return visitor.visitModuleStmt(this)
  }
}
exports.ModuleStmt = ModuleStmt

class FunctionStmt extends Statement {
  constructor(name, params, statements) {
    super()
    this.name = name
    this.params = params
    this.statements = statements
  }

  accept(visitor) {
    return visitor.visitFunctionStmt(this)
  }
}
exports.FunctionStmt = FunctionStmt

class ExpressionStmt extends Statement {
  constructor(expression) {
    super()
    this.expression = expression
  }

  accept(visitor) {
    return visitor.visitExpressionStmt(this)
  }
}
exports.ExpressionStmt = ExpressionStmt

class ReturnStmt extends Statement {
  constructor(keyword, value) {
    super()
    this.keyword = keyword
    this.value = value
  }

  accept(visitor) {
    return visitor.visitReturnStmt(this)
  }
}
exports.ReturnStmt = ReturnStmt