'use strict'

/**
*   Standalone Script for Navigation Menu Behavior
*/

document.querySelectorAll('.nav-anchor').forEach( function (nav_opt) {

  nav_opt.addEventListener('click', function (event) {

    var self = this.innerText
    var toggle_arr = this.getAttribute('data-display').split(',')
    var decor_arr = this.getAttribute('data-decor').split(',')
    var subnav = document.querySelector('#' + this.id + '-list').parentElement

    document.querySelectorAll('.nav-anchor').forEach( function (sibling) {

      var sibling_subnav = (document.querySelector('#' + sibling.id + '-list')) ?
        document.querySelector('#' + sibling.id + '-list').parentElement : null

      if (sibling.innerText!=self) {
        sibling.style.opacity = (toggle_arr[0]!='none') ? '0.33' : '1'

        if (sibling_subnav) {
          sibling_subnav.style.display = 'none'
          sibling.style.textDecoration = 'none'
          sibling.setAttribute('data-display','block,none')
          sibling.setAttribute('data-decor','underline,none')
        }
      }
    })
    subnav.style.display = toggle_arr[0]
    this.style.textDecoration = decor_arr[0]
    this.style.opacity = '1'
    toggle_arr.reverse()
    decor_arr.reverse()
    this.setAttribute('data-display',toggle_arr.join(','))
    this.setAttribute('data-decor',decor_arr.join(','))
  })
})
// Open nav modal
document.querySelector('#nav-hex').addEventListener('click', function (event) {
  document.querySelector('#nav-hex').style.display = 'none'
  document.querySelector('#nav-modal-shell').style.display = 'block'
  document.querySelector('#app').style.opacity = 0.3
})
// Close nav modal
document.querySelector('#close-nav-modal').addEventListener('click', function (event) {
  document.querySelector('#nav-modal-shell').style.display = 'none'
  document.querySelector('#nav-hex').style.display = 'block'
  document.querySelector('#app').style.opacity = 1
})
