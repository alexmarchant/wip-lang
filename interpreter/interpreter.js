const Environment = require('./environment.js')
const RuntimeFunction = require('./runtime-function.js')
const RuntimeModule = require('./runtime-module.js')

class Interpreter {
  constructor(statements) {
    this.environment = new Environment()
    this.globals = this.environment
    this.statements = statements
  }

  interpret() {
    this.statements.forEach(statement => {
      this.execute(statement)
    })
  }

  execute(statement) {
    statement.accept(this)
  }

  visitModuleStmt(statement) {
    const mod = new RuntimeModule(statement)
    this.environment.define(statement.name.source, mod)
  }

  visitFunctionStmt(statement) {
    const func = new RuntimeFunction(statement, this.environment)
    this.environment.define(statement.name.source, func)
  }
}
module.exports = Interpreter