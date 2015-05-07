# denial-stream

Prevent [unpiping on error](https://github.com/iojs/readable-stream/blob/214a7eb1719b524e78c7634eaee6bd408e6c532f/lib/_stream_readable.js#L565-L573) in stream

[![build status](http://img.shields.io/travis/timhudson/denial-stream.svg?style=flat)](http://travis-ci.org/timhudson/denial-stream)

## Example

``` js
var denialStream = require('denial-stream')
var from = require('from2')
var through = require('through2')

var dataStream = from.obj([1, 2, 3, 4, 5, 6, 7])

var failStream = through.obj(function(chunk, enc, callback) {
  if (chunk % 2) return callback(new Error('not cool'))
  this.push(chunk + '')
  callback()
})

// Errors are still emitted from original stream
failStream.on('error', function (err) {
  console.log(err)
})

dataStream
  // No error events will be emitted from denialStream
  .pipe(denialStream(failStream))
  .pipe(process.stdout)
```

## Usage

### var d = denialStream(stream)

Wraps a readable/writable stream in a new stream

## Events

### d.on('deniedError', function (err) {})

The `deniedError` event is emitted when the passed in stream emits an error. `deniedStream`
suppresses normal `error` events to prevent the stream from
[unpiping](https://github.com/iojs/readable-stream/blob/214a7eb1719b524e78c7634eaee6bd408e6c532f/lib/_stream_readable.js#L565-L573)
and instead forwards errors with the `deniedError` event.

## License

MIT
