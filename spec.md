# WIP Lang

## Vars
```ts
var a: Int
var a = 1

// Constant, can't reassign or modify structs/arrays/maps etc
const a = 1
```

## Arrays
```ts
var arr = [1, 2, 3]
const last = arr.pop()
arr.push(4)
var arr: [Int]

const arr [1, 2, 3]
arr.push(4) // Error, modifying constant
```

## Maps
```ts
const last_names = {
  // String keys don't need quotes
  Alex: "Marchant",
  Larson: "Laidlaw",
}

// Dot notation works
const last_name = last_names.Alex

// Type sig
var last_names: { String: String }
```

## Functions
```ts
fn add(a: Int, b: Int) Int {
  return a + b
}

// Param names in invocation
const sum = add(a: 1, b: 2)

// annonymous
const add = (a: Int, b: Int) => Int {
  return a + b
}

// Type sig
var add: (a: Int, b: Int) => Int
add = (a: Int, b: Int) => Int {
  return a + b
}

// Multi-return
fn divide(num: Float, div: Float) (Float, String) {
  if div == 0 {
    return nil, "Can't divide by 0"
  }
  return num / div, nil
}

const res, error_message = divide(num: 4, div: 1)

// Ignore from multi-return
const _, error_message = divide(num: 4, div: 1)

// or
const res, _ = divide(num: 4, div: 1)

// Can't leave out any return value, thats a compiler error
const res = divide(num: 4, div: 1) // Error
```

## Structs
```ts
struct Square {
  width: Float
  height: Float

  area() Float {
    return this.width * this.height
  }
}

// Implicit inits include all fields that don't have defaults
const sq = Square(width: 5, height: 6)

// Methods as expected
const area = sq.area()
```

## Protocols
```ts
protocol Vehicle {
  max_passengers: Int
  // Allows defaults fields
  current_passengers = 0
  // Methods 
  doors() Int
  // Allows default methods
  add_passenger(name: String) {
    this.current_passengers++
  }
}

struct Car: Vehicle {
  max_passengers = 5

  doors() Int {
    return 5
  }
}

struct Van: Vehicle {
  max_passengers = 8

  doors() Int {
    return 4
  }
}

// Accept a protocol
fn can_add_passenger_to(vehicle: Vehicle) Bool {
  return vehicle.current_passengers < vehicle.max_passengers
}

// All fields have defaults so default init is empty
const car = Car()
const van = Van()

// Takes car or van
can_add_passenger_to(vehicle: car) // true
van.add_passenger("Alex")
van.add_passenger("Rachel")
van.add_passenger("Austin")
van.add_passenger("Larson")
van.add_passenger("Carter")
van.add_passenger("Helen")
van.add_passenger("Kelsey")
van.add_passenger("Lauren")
can_add_passenger_to(vehicle: van) // false

// Custom inits
struct CarWithSomeBrokenSeats {
  init(broken_seats: Int) {
    this.max_passengers = 5 - broken_seats
  }
}
const car = CarWithSomeBrokenSeats(broken_seats: 4)
car.add_passenger("Alex")
can_add_passenger_to(vehicle: car) // false

// Multiple protocols
struct List: Equatable, Enumerable {}
```

## Modules

```ts
// Importing
import http
import file
import json

const res = http.get(url: "https://api.com/resource")
const file_contents = file.read(file_path: "./data.json")
const data = json.parse(string: file_contents)

// Exporting
// Declare module at top of file
module api

import user
import http
import json

// Export vars
export const base_url = "http://api.com/"

// Export functions
export fn get_user(id: Int) user.User {
  const url = make_url(path: "users")
  const res = http.get(url: url)
  const data = json.parse(string: res.body)
  const user = user.User(json: data)
  return user
}

// private function
fn make_url(path: String) String {
  return base_url + path
}

// The entry point is always a file called main.wip, and its modules is always called main
module main

// Main function is entry point
fn main() {
}

// Two files with the same module name share private vars and functions
// a.wip
module stuff

const name = "Alex"

// b.wip
module stuff

import print

fn print_name() {
  print.line(string: name)
}
```

## Enums

```ts
enum Day {
  Mon
  Tue
  Wed
  Thur
  Fri
  Sat
  Sun
}

const today = Day.Mon

fn what_day_is_today() Day {
  return Day.Mon
}

// Can hold values
enum Result {
  Success(value: Float)
  Failure
}

const num: Float = 5
const div: Float = 4
fn divide(num: Float, div: Float) Result {
  if div == 0 {
    return Result.Failure
  }
  return Result.Success(value: num / div)
}

const res = divide(num: 5, div: 4)

// Can match enums
match res {
  Success(value) => print.line("Success: ${value}"),
  Failure => {
    print.line("Failed to divide ${num} by ${div}")
  }
}
```

## Generics

Trying to make generics more friendly

```ts
// Enums
// Type is a special type that just means any type
enum Result(type: Type) {
  Success(value: type)
  Failure
}

// Can generate an enum of any type
const FloatResult = Result(type: Float)

fn divide(num: Float, div: Float) FloatResult {
  if div == 0 {
    return FloatResult.Failure
  }
  return FloatResult.Success(value: num / div)
}

const res = Result.Success(value: 4) // Error, must declare Result with type
const res = Result(type: Float).Success(value: 4) // This works

// Functions
fn add(type: Type)(a: type, b: type) type {
  return a + b
}
const sum = add(type: Float)(a: 1.2, b: 4.3)

// Can store typed function in a var
const int_add = add(type: Int)
const sum = int_add(a: 1, b: 2)
```

## Async

```ts
import http
import time

const res = await http.get(url: "http://google.com")

async fn sleep(ms: Int) {
  time.wait(ms)
}
await sleep(ms: 1000)

```