'use strict'

var toggle_ops = [
  function (textval) {
    var div = document.createElement('div')
    var node = document.createTextNode(textval)
    div.className = 'toggle-in'
    div.appendChild(node)
    return div
  },
  function (textval) {
    var input = document.createElement('input')
    input.value = textval
    input.className = 'edit-profile-input toggle-in'
    return input
  }
]

function toggle_input(el,arg) {
  var val = el.getAttribute('data-toggle')
  var text = (Number(val)) ? el.innerText : el.value
  console.log(val)
  //console.log(text)
  var parent = el.parentElement
  var sibling = el.nextElementSibling
  var new_el = toggle_ops[Number(val)](text)
  var new_att = ( Number(val) ) ? '0' : '1'
  new_el.setAttribute('data-toggle',new_att)
  parent.removeChild(el)
  parent.insertBefore(new_el,sibling)
}

function init() {
  var appendix = document.querySelector('#form-appendix')
  if (!appendix) {
    return false;
  } else {
    var edit_links = document.querySelectorAll('.toggle-it')
    edit_links.forEach( function (edit_link) {

      if (edit_link.id!='lock-icon-wrapper') {

        edit_link.addEventListener( 'click', function (event) {
          var val = Number(this.getAttribute('data-toggle'))
          var new_att = (val) ? '0' : '1'
          var indexed_el = this.previousElementSibling
          console.log(indexed_el)
          console.log(indexed_el.value)
          toggle_input(indexed_el,val)
          this.setAttribute('data-toggle',new_att)
        })
      }
    })
  }
}

init()
