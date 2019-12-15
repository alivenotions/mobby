const codeAreas = document.getElementsByClassName('code')
const info = document.getElementById('info')
const output = window.frames[0].window

codeAreas[0].focus()

const URL = 'ws://localhost:8080'
let RECONNECT_DELAY = 200
let ws

connect(URL)

let typingIdleTimer
let DELAY = 1400
Array.from(codeAreas).forEach(codeArea => codeArea.addEventListener('keyup', (e) => {
  if (typingIdleTimer) { clearTimeout(typingIdleTimer) }
  const [html, css, js] = Array.from(codeAreas).map(x => x.value)
  generateOutput(output, html, css, js)
  typingIdleTimer = setTimeout(() => ws.send(codeAreas[2].value), DELAY)
}))
Array.from(codeAreas).forEach(codeArea => codeArea.addEventListener('keydown', () => {
  if (typingIdleTimer) { clearTimeout(typingIdleTimer) }
}))

function generateOutput(target, html, css, js) {
  target.document.head = `<style>${css}</style><script>${js}</script>`
  target.document.body.innerHTML = `${html}`
}

function connect(url) {
    const connection = new WebSocket(URL)
    connection.onopen = () => {
        console.log('Connection open')
        connection.send(codeAreas[2].value)
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
