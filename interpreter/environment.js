const RuntimeError = require('./runtime-error.js')

class Environment {
  constructor(enclosing) {
    this.enclosing = enclosing
    this.values = {}
  }

  define(name, value) {
    this.values[name] = value
  }

  get(nameToken) {
    if (this.values.hasOwnProperty(nameToken.source)) {
      return this.values[nameToken.source]
    }

    if (this.enclosing) {
      return this.enclosing.get(nameToken)
    }

    return new RuntimeError(
      nameToken,
      `Undefined variable '${nameToken.source}'.`
    )
  }
}
module.exports = Environment