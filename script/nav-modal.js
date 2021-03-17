'use strict'

var app_shell = document.querySelector('#app')
var nav_open = document.querySelector('#nav-hex')
var nav_close = document.querySelector('#close-nav-modal')
var nav_shell = document.querySelector('#nav-modal-shell')

nav_open.addEventListener('click', function (event) {
  var dim = 0.3
  nav_modal_toggle(this,nav_shell,dim)
})

nav_close.addEventListener('click', function (event) {
  var bright = 1
  nav_modal_toggle(nav_shell,nav_open,bright)
})

function nav_modal_toggle(hide_me,show_me,opacity) {
  hide_me.style.display = 'none'
  show_me.style.display = 'block'
  app_shell.style.opacity = opacity

}
