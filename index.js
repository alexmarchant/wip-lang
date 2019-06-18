import fs from 'fs'
import Scanner from './scanner/index.js'
import Parser from './parser/index.js';

if (process.argv.length < 3) {
  throw new Error('Src file path is required')
}

// Get file
const path = process.argv[2]
const source = fs.readFileSync(path).toString()

// Scan tokens
const scanner = new Scanner(source)
const tokens = scanner.scanTokens()
console.log(tokens)

// Parse statements
const parser = new Parser(tokens)
const statements = parser.parse()
console.log(statements)