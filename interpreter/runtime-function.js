const Environment = require('./environment.js')

class RuntimeFunction {
  constructor(declaration, closure) {
    this.declaration = declaration
    this.closure = closure
  }

  callFunction(interpreter, args) {
    const environment = new Environment(this.closure)
    interpreter.executeBlock(this.declaration.statements, environment)
  }

  arity() {
    return this.declaration.params.length
  }
}
module.exports = RuntimeFunction