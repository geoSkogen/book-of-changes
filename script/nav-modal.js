'use strict'

var nav_open = document.querySelector('#nav-hex')
var nav_close = document.querySelector('#close-modal')
var nav_shell = document.querySelector('#nav-modal-shell')

nav_open.addEventListener('click', function (event) {
  nav_modal_toggle(this,nav_shell)
})

nav_close.addEventListener('click', function (event) {
  nav_modal_toggle(nav_shell,nav_open)
})

function nav_modal_toggle(hide_me,show_me) {
  hide_me.style.display = 'none'
  show_me.style.display = 'block'
}
