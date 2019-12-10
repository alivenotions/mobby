import WebSocket from 'ws'
import vm from 'vm'

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received a message: ${message}`)
    try {
      const script = new vm.Script(message)
      // script.runInContext(vm.createContext({}))
      ws.send('Saved')
    }
    catch(e) {
      ws.send(`The syntax seems off. Error: ${e.message}`)
    }
  })
  ws.send('Hola!')
})
