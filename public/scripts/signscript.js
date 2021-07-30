const form = document.querySelector('.signupform')
const usernameError = document.querySelector('.username.error')
const emailError = document.querySelector('.email.error')
const passwordError = document.querySelector('.password.error')

const sighupController = (() => {
    let close = false

    form.addEventListener('submit', (event) => {
        event.preventDefault()
        if(close) return
        
        close = true
        // clean error fields
        usernameError.textContent = ''
        emailError.textContent = ''
        passwordError.textContent = ''
    
        const username = form.username.value
        const email = form.email.value
        const password = form.password.value
        
        fetch('/signup', {
            method: 'POST',
            body: JSON.stringify({username, email, password}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                if(data.errors) {
                    usernameError.textContent = data.errors.username
                    emailError.textContent = data.errors.email
                    passwordError.textContent = data.errors.password
                    close = false
                }
                if(data.user) {
                    location.assign('/')
                }
            })
    })
})()
