const RuntimeFuntion = require('./runtime-function.js')

class Print extends RuntimeFuntion {
  callFunction(interpreter, args) {
    console.log(args[0])
  }

  arity() {
    return 1
  }
}

function registerNativeFunctions(interpreter) {
  interpreter.globals.define('print', new Print())
}
exports.registerNativeFunctions = registerNativeFunctions