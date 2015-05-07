var test = require('tape')
var denialStream = require('./')
var from = require('from2')
var through = require('through2')

test('Does not unpipe on errors', function (t) {
  t.plan(3)

  var dataStream = from.obj([1, 2, 3, 4, 5, 6, 7])

  var failStream = through.obj(function (chunk, enc, callback) {
    if (chunk % 2) return callback(new Error('not cool'))
    this.push(chunk + '')
    callback()
  })

  dataStream
    .pipe(denialStream(failStream))
    .pipe(through.obj(function (chunk, enc, callback) {
      t.ok(chunk, 'continues to write chunks')
      callback()
    }))
})

test('Emits denied errors', function (t) {
  t.plan(6)

  var dataStream = from.obj([1, 2, 3, 4, 5])

  var failStream = through.obj(function (chunk, enc, callback) {
    if (chunk % 2) return callback(new Error('not cool'))
    this.push(chunk + '')
    callback()
  })

  failStream.on('error', function (err) {
    t.equal(err.message, 'not cool', 'errors still emitted from passed in stream')
  })

  dataStream
    .pipe(denialStream(failStream))
    .on('deniedError', function (err) {
      t.equal(err.message, 'not cool', 'emits denied errors')
    })
    .pipe(through.obj())
})
