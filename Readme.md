[![Build Status](https://secure.travis-ci.org/vesln/timekeeper.png)](http://travis-ci.org/vesln/timekeeper)

# timekeeper

## Description

This module mocks `Date` and `Date.now` in order to help you test time-dependent code.
Provides `travel` and `freeze` functionality for your Node.js tests.

## Features/problems

- Please note, that if you are using time freezing, the `setTimeout` and
  `setInteval` won't work as exepcted, since they are using the `Date`
  class but the time will not change until you call `timekeeper#reset`.

## Synopsis

### Freeze:

```js
var tk = require('timekeeper');
var time = new Date(1330688329321);

tk.freeze(time);

// The time hasn't changed at all.

var date = new Date;
var ms = Date.now();

tk.reset(); // Reset.

```

### Travel:

```js
var tk = require('timekeeper');
var time = new Date(1893448800000); // January 1, 2030 00:00:00

tk.travel(time); // Travel to that date.

setTimeout(function() {

	// `time` + ~500 ms.

	var date = new Date;
	var ms = Date.now();

	tk.reset(); // Reset.

}, 500);
```

### Reflection:

```js
var tk = require('timekeeper');
var time = new Date(1893448800000); // January 1, 2030 00:00:00

assertFalse(tk.isKeepingTime());
tk.travel(time);
assertTrue(tk.isKeepingTime());
```


## Requirements

- npm (http://npmjs.org/)
- Node.js (http://nodejs.org/)

## Install

```
$ npm install timekeeper
```

## Tests

```
$ cd timekeeper
$ npm install
$ make test
```

## Credits

Inspired by the [timecop](https://github.com/jtrupiano/timecop) ruby gem.

## License

MIT License

Copyright (C) 2012 Veselin Todorov

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
