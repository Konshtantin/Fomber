const menuIcon = document.querySelector('.menu-icon')
const mobileMenu = document.querySelector('.mobile-menu')
const sidebar = document.querySelector('.sidebar')


const mobileSidebarController = (() => {
    mobileMenu.addEventListener('click', (event) => {
        sidebar.classList.toggle('active')
    })
})()