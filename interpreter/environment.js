class Environment {
  constructor(enclosing) {
    this.enclosing = enclosing
    this.values = {}
  }

  define(name, value) {
    this.values[name] = value
  }
}
module.exports = Environment