const codeTextArea = document.getElementById('code')
const info = document.getElementById('info')
code.focus()
const URL = 'ws://localhost:8080'
let RECONNECT_DELAY = 200
let ws
function connect(url) {
    const connection = new WebSocket(URL)
    connection.onopen = () => {
        console.log('Connection open')
        connection.send(codeTextArea.value)
        RECONNECT_DELAY = 200
    }

    connection.onmessage = (message) => {
        info.textContent = message.data
    }

    connection.onerror = (error) => {
        console.log(`Error: ${JSON.stringify(error, ['message', 'arguments'], 2)}`)
        connection.close()
    }

    connection.onclose = (event) => {
        console.log(`Socket closed because of the following reasons: ${event.reason}`)
        RECONNECT_DELAY = RECONNECT_DELAY * 2
        setTimeout(() => {
            connect(url)
        }, RECONNECT_DELAY)
    }

    ws = connection
}

connect(URL)

let typingIdleTimer
let DELAY = 1400
codeTextArea.addEventListener('keyup', (e) => {
  if (typingIdleTimer) { clearTimeout(typingIdleTimer) }
  typingIdleTimer = setTimeout(() => ws.send(codeTextArea.value), DELAY)
})
codeTextArea.addEventListener('keydown', () => {
  if (typingIdleTimer) { clearTimeout(typingIdleTimer) }
})
