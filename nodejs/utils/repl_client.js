var net = require('net')

var replClient = net.createConnection({path: '/tmp/node-repl.sock'});

process.stdin.pipe(replClient)
replClient.pipe(process.stdout)

replClient.on('connect', function () {
  process.stdin.resume();
  process.stdin.setRawMode(true)
})

/*
replClient.on('close', function done () {
  process.stdin.setRawMode(false)
  process.stdin.pause()
  replClient.removeListener('close', done)
})

process.stdin.on('end', function () {
  replClient.destroy()
  console.log()
})

process.stdin.on('data', function (b) {
  if (b.length === 1 && b[0] === 4) {
    process.stdin.emit('end')
  }
})
*/
