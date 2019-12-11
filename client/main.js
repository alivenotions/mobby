const jsCodeTextArea = document.getElementById('js')
const info = document.getElementById('info')
jsCodeTextArea.focus()
const URL = 'ws://localhost:8080'
let RECONNECT_DELAY = 200
let ws
function connect(url) {
    const connection = new WebSocket(URL)
    connection.onopen = () => {
        console.log('Connection open')
        connection.send(jsCodeTextArea.value)
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
jsCodeTextArea.addEventListener('keyup', (e) => {
  if (typingIdleTimer) { clearTimeout(typingIdleTimer) }
  typingIdleTimer = setTimeout(() => ws.send(jsCodeTextArea.value), DELAY)
})
jsCodeTextArea.addEventListener('keydown', () => {
  if (typingIdleTimer) { clearTimeout(typingIdleTimer) }
})
