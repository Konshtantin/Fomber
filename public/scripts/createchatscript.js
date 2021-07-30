const roleButtons = document.querySelectorAll('.role-button')
const createButton = document.querySelector('.create')
const createChatForm = document.querySelector('.createchatform')
const chatnameError = document.querySelector('.chatname-error')
const chatUsersError = document.querySelector('.chatuserserror')

const createChatController = (() => {

    let close = false
    const chatusers = []

    roleButtons.forEach(roleButton => {
        roleButton.addEventListener('click', (event) => {
            event.preventDefault()

            // если нажимают на изображение в кнопке, то кнопка равна родителю таргета(изображения), иначе самому таргету
            const button = event.target.nodeName === 'IMG' ? event.target.parentElement : event.target
            // id пользователя, которого хотят добавить в чат
            const id = button.parentElement.parentElement.dataset.userid
            // ищем пользователя по id в кандидатах на добавление
            const index = chatusers.findIndex(user => user.userid === id)
            // если находим пользователя
            if(index > -1) {
                // если прошлая выбранная роль равна нынешней роли
                if(chatusers[index].role === button.dataset.role) {
                    // удаляем прошлый обЪект с пользователем
                    chatusers.splice(index, 1)
                    roleButton.classList.remove('active')
                } else {
                    roleButton.parentElement.querySelector(`[data-role="${chatusers[index].role}"]`).classList.remove('active')
                    chatusers[index].role = button.dataset.role
                    roleButton.classList.add('active')
                }
                return 
            } 
            // если не находим пользователя то добавляем класс active кнопке и добавляем пользователя в список
            roleButton.classList.add('active')
            chatusers.push({userid: id, role: button.dataset.role})
        })
    }) 

    createButton.addEventListener('click', (event) => {
        event.preventDefault()
        if(close) return
        const chatname = createChatForm.chatname.value.trim()
        if(chatname.length < 4) {
            chatnameError.textContent = "Chat Name length must't be less then 4"
            return
        }
        if(chatusers.length === 0) {
            chatUsersError.textContent = 'There must be no less than one person in the chat besides you'
            return
        }
        close = true
        fetch('/chat/createchat', {
            method: 'POST',
            body: JSON.stringify({
                chatusers,
                chatname
            }),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                if(data.error) {
                    location.href = data.error
                    return
                }
                if(data.chat) {
                    location.assign('/chat/' + data.chat)
                }
            })
    })
})()
