const { ExpressPeerServer } = require('peer');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000



app.use(express.static('client'))
const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

const peerServer = ExpressPeerServer(server, { path: '/' });
app.use('/peer', peerServer)


peerServer.on('error', (e) => {
  console.log(e)
})

// peerServer.listen((e) => {
//   console.log(e)
// })