'use strict'

var filter_icon = document.querySelector('#hex-filter');

filter_icon.addEventListener('click', toggle_filter_menu)

function toggle_filter_menu() {
  var props = ['block','none']
  var reset_val = null
  var current_val = (Number(filter_icon.getAttribute('data-toggle')))
  reset_val = (current_val) ? 0 : 1
  document.querySelector('#filter-menu').style.display=props[current_val]
  fitler_iocn.setAttribute('data-toggle',reset_val)
}
