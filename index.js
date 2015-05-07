var through = require('through2')

module.exports = function (stream) {
  var tr = through.obj(function (chunk, enc, callback) {
    stream.write(chunk)
    callback()
  })

  stream.on('data', tr.push.bind(tr))
  stream.on('error', function (err) {
    tr.emit('deniedError', err)
  })

  return tr
}
