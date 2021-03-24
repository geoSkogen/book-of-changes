'use strict'

var menu = document.querySelector('#trigram-menu')
var links = document.querySelectorAll('.trigram-char')

for (var t = 0; t < links.length; t++) {
  var anchor = links[t]
  var name = tri_names_arr[t][0]
  anchor.parentElement.id = name
  anchor.id = name + '-link'
  anchor.href += name
  anchor.querySelector('.tri-lines-char').innerHTML = tri_lines_chars_arr[t]
  anchor.querySelector('.tri-lines-name').innerHTML = name
}
