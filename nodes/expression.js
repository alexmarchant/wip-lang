class Expression {}
exports.Expression = Expression

class BinaryExpr extends Expression {
  constructor(left, operator, right) {
    super()
    this.left = left
    this.operator = operator
    this.right = right
  }
}
exports.BinaryExpr = BinaryExpr

class LiteralExpr extends Expression {
  constructor(value) {
    super()
    this.value = value
  }
}
exports.LiteralExpr = LiteralExpr