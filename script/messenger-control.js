'use strict'

var msg_icons = [
  document.querySelectorAll('.message-user'),
  document.querySelectorAll('.hexmessage-user')
]

var close_modals = document.querySelectorAll('.close-modal-form')

msg_icons.forEach( function (click_icons) {
  click_icons.forEach( function (click_icon) {
    click_icon.addEventListener('click', function (event) {
      var modal_id = this.className.replace('user','modal')
      var modal = document.querySelector('#' + modal_id)
      modal.style.display = 'block'
    })
  })
})

close_modals.forEach( function (x_out) {
  x_out.addEventListener( 'click', function (event) {
    this.parentElement.parentElement.style.display = 'none'
  })
})
