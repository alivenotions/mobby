import WebSocket from 'ws'
import vm from 'vm'
import jsdom from 'jsdom'
const { JSDOM } = jsdom
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received a message: ${message}`)
    try {
      const script = new vm.Script(message)
      const { window } = new JSDOM('<!DOCTYPE html><p></p>')
      script.runInContext(vm.createContext(window))
      ws.send('Saved')
    }
    catch(e) {
      ws.send(`The syntax seems off. Error: ${e.message}`)
    }
  })
  ws.send('Hola!')
})
