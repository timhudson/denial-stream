var denialStream = require('./')
var from = require('from2')
var through = require('through2')

var dataStream = from.obj([1, 2, 3, 4, 5, 6, 7])

var failStream = through.obj(function (chunk, enc, callback) {
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
