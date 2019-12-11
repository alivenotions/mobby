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
        connection.close()
    }

    connection.onclose = (event) => {
        RECONNECT_DELAY = RECONNECT_DELAY * 1.5
        console.log(`Socket closed, retrying in ${(RECONNECT_DELAY / 1000).toFixed(1) } seconds`)
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
