const messageInput = document.querySelector('#message')
const sendButton = document.querySelector('.send')
const mesBoard = document.querySelector('.message-board')

const writeMessageController = (() => {
    let close = false

    const scrollToEnd = () => {
        mesBoard.scrollTop += mesBoard.scrollHeight
        window.scrollY += innerHeight
    }
    
    const createMessage = (text, date) => {
        const message = document.createElement('div')
        const messageAuthor = document.createElement('div')
        const messageText = document.createElement('div')
        const messageDate = document.createElement('div')
    
        message.classList.add('message', 'self')
        messageAuthor.classList.add('message-author')
        messageText.classList.add('message-text')
        messageDate.classList.add('message-date')
    
        messageAuthor.textContent = 'Вы'
        messageText.textContent = text
        messageDate.textContent = date
    
        message.append(...[messageAuthor, messageText, messageDate])
        mesBoard.append(message)
    }
    
    
    const sendMessage = () => {
        const text = messageInput.value.trim()
        const chat = location.pathname.split('/')[2]
        if(text.length === 0 || text.length > 1000 || close) return
        close = true
        fetch('/chat/message', {
            method: 'POST',
            body: JSON.stringify({text, chat, date: Date.now()}),
            headers: {'Content-Type': 'application/json'}
        })  
            .then(response => response.json())
            .then(data => {
                if(data.message) {
                    messageInput.value = ''
                    createMessage(text, data.message.date)
                    close = false
                }
            })
    }
    
    const enterMessage = (event) => {
        if(close) return
        if(event.code = 'Enter' && messageInput.value.trim().length > 0) {
            sendMessage()
        }
    }
    
    
    messageInput.addEventListener('focus', (event) => {
        document.removeEventListener('keydown', enterMessage)
    })
    
    messageInput.addEventListener('blur', (event) => {
        document.addEventListener('keydown', enterMessage)
    })
    
    sendButton.addEventListener('click', (event) => {
        if(close) return
        sendMessage()
    })
    
    onload = scrollToEnd()
})()



