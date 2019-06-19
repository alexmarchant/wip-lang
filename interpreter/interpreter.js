const Environment = require('./environment.js')
const RuntimeFunction = require('./runtime-function.js')
const RuntimeModule = require('./runtime-module.js')
const RuntimeError = require('./runtime-error.js')
const { registerNativeFunctions } = require('./native-functions.js')

class Interpreter {
  constructor(statements) {
    this.environment = new Environment()
    this.globals = this.environment
    this.statements = statements
  }

  interpret() {
    registerNativeFunctions(this)

    try {
      // One pass to define funtions and setup
      this.statements.forEach(statement => {
        this.execute(statement)
      })

      // Try to get the main function
      const main = this.environment.values['main']
      if (!main instanceof RuntimeFunction) {
        throw new RuntimeError(
          null,
          'Expected a function \'main\' to be declared'
        )
      }

      // Execute the main function
      main.callFunction(this, [])
    } catch(err) {
      this.error(err)
    }
  }

  execute(statement) {
    statement.accept(this)
  }

  executeBlock(statements, environment) {
    const previousEnv = this.environment
    this.environment = environment

    statements.forEach(statement => {
      this.execute(statement)
    })

    this.environment = previousEnv
  }

  evaluate(expression) {
    return expression.accept(this)
  }

  // STMT
  visitModuleStmt(statement) {
    // TODO
  }

  visitFunctionStmt(statement) {
    const func = new RuntimeFunction(statement, this.environment)
    this.environment.define(statement.name.source, func)
  }

  visitReturnStmt(statement) {
    let value
    if (statement.value) {
      value = this.evaluate(statement.value)
    }

    throw new RuntimeError(
      null,
      null,
      true,
      value
    )
  }

  visitExpressionStmt(statement) {
    return this.evaluate(statement.expression)
  }

  // EXPR
  visitBinaryExpr(expression) {
    const left = this.evaluate(expression.left)
    const right = this.evaluate(expression.right)
    return left + right
  }

  visitLiteralExpr(expression) {
    return expression.value
  }

  visitCallExpr(expression) {
  	const func = this.evaluate(expression.calleeExpr)
    const args = expression.args.map(arg => this.evaluate(arg))

    if (!func instanceof RuntimeFunction) {
      throw new RuntimeError(
        expression.paren,
        'Can only call functions and classes.',
      )
    }

    // Check arity
    if (args.length != func.arity()) {
      const message = `Expected ${func.arity()} arguments but got ${args.length}.`
      throw new RuntimeError(
        expression.paren,
        'Can only call functions and classes.',
      )
    }

    return func.callFunction(this, args)
  }

  visitVarExpr(expression) {
    return this.lookupVariable(expression.nameToken, expression)
  }

  // Other

  lookupVariable(nameToken, expression) {
    return this.environment.get(nameToken)
  }

  error(err) {
    if (err.token) {
      console.error(`[line ${err.token.line}]:`)
    }
    console.error(err.stack)
    this.hadRuntimeError = true
  }
}
module.exports = Interpreter