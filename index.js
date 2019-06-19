const fs = require('fs')
const util = require('util')
const Scanner = require('./scanner/scanner.js')
const Parser = require('./parser/parser.js')
const Interpreter = require('./interpreter/interpreter.js')

if (process.argv.length < 3) {
  throw new Error('Src file path is required')
}

// Get file
const path = process.argv[2]
const source = fs.readFileSync(path).toString()

// Scan tokens
const scanner = new Scanner(source)
const tokens = scanner.scanTokens()
// console.log(tokens)

// Parse statements
const parser = new Parser(tokens)
const statements = parser.parse()
// console.log(util.inspect(statements, true, 10))

if (parser.hasError) {
  return
}

// Interpret statements
const interpreter = new Interpreter(statements)
interpreter.interpret()