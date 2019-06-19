# Grammar

## Program

```
program -> declaration* EOF;
```

## Declarations

```
declaration -> moduleDecl
  | fnDecl
  | statement;

moduleDecl -> "module" IDENTIFIER;
fnDecl -> "fn" function;
```

## Statements

```
statement -> exprStmt
  | returnStmt
  | block;

exprStmt -> expression;
returnStmt -> "return" expression?;
block -> "{" statement* "}";
```

## Expressions

```
expression -> addition;
addition -> primary ( ("+" | "-") primary )*;
primary -> INT, FLOAT;
```

## Utitity Rules

```
function -> IDENTIFIER "(" parameters? ")" block;
parameters -> IDENTIFIER ("," IDENTIFIER )*;
```
