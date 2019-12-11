const codeTextArea = document.getElementById('code')
const info = document.getElementById('info')
code.focus()
const url = 'ws://localhost:8080'

const connection = new WebSocket(url)
connection.onopen = () => {
  console.log('Connection open')
}

connection.onmessage = (message) => {
  info.textContent = message.data 
}

connection.onerror = (error) => {
  console.log(`Error: ${JSON.stringify(error, ['message', 'arguments'], 2)}`)
}

let typingIdleTimer
let DELAY = 1400
codeTextArea.addEventListener('keyup', (e) => {
  if (typingIdleTimer) { clearTimeout(typingIdleTimer) }
  typingIdleTimer = setTimeout(() => connection.send(codeTextArea.value), DELAY)
})
codeTextArea.addEventListener('keydown', () => {
  if (typingIdleTimer) { clearTimeout(typingIdleTimer) }
})
