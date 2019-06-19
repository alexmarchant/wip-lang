class Expression {
  accept(visitor) {
    throw new Error('Abstract method not implemented')
  }
}
exports.Expression = Expression

class BinaryExpr extends Expression {
  constructor(left, operator, right) {
    super()
    this.left = left
    this.operator = operator
    this.right = right
  }

  accept(visitor) {
    return visitor.visitBinaryExpr(this)
  }
}
exports.BinaryExpr = BinaryExpr

class LiteralExpr extends Expression {
  constructor(value) {
    super()
    this.value = value
  }

  accept(visitor) {
    return visitor.visitLiteralExpr(this)
  }
}
exports.LiteralExpr = LiteralExpr

class CallExpr extends Expression {
  constructor(calleeExpr, parenToken, args) {
    super()
    this.calleeExpr = calleeExpr
    this.parenToken = parenToken
    this.args = args
  }

  accept(visitor) {
    return visitor.visitCallExpr(this)
  }
}
exports.CallExpr = CallExpr

class VarExpr extends Expression {
  constructor(nameToken) {
    super()
    this.nameToken = nameToken
  }

  accept(visitor) {
    return visitor.visitVarExpr(this)
  }
}
exports.VarExpr = VarExpr