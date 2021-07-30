const form = document.querySelector('.loginform')
const emailError = document.querySelector('.email.error')
const passwordError = document.querySelector('.password.error')


const loginController = (() => {
    let close = false
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        if(close) return

        close = true
        // clean error fields
        emailError.textContent = ''
        passwordError.textContent = ''
    
        const email = form.email.value
        const password = form.password.value
        fetch('/login', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                if(data.errors) {
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
