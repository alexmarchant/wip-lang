export const FunctionType = {
  Function: 'Function'
}

export class Statement {}

export class Module extends Statement {
  constructor(name) {
    super()
    this.name = name
  }
}

export class Function extends Statement {
  constructor(name, params, statements) {
    super()
    this.name = name
    this.params = params
    this.statements = statements
  }
}
