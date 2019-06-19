class RuntimeError {
  constructor(token, message, isReturn, returnValue) {
    this.token = token
    this.message = message
    this.isReturn = isReturn
    this.returnValue = returnValue
  }
}
module.exports = RuntimeError