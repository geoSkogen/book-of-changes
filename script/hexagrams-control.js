'use strict'

var hexagrams_menu = document.querySelector('#hexagram-menu')
var data_index = 0
function set_dom () {
  hex_name_arr.forEach( function (hex_names) {
    if (data_index) {
    console.log(data_index)
    console.log(hex_chars_table[data_index][0])
    var el = {}
    var hex_frame = document.createElement('a')
    var anchor_nodes = {
      lines_frame : document.createElement('div'),
      name_frame : document.createElement('div'),
      char_frame : document.createElement('div')
    }
    var text_nodes = {
      lines_text : document.createTextNode(hex_lines_chars_arr[data_index]),
      name_text : document.createTextNode(hex_names),
      char_text : document.createTextNode(hex_chars_table[data_index][0]),
    }
    for (var i = 0; i < Object.keys(anchor_nodes).length;i++) {
      el = anchor_nodes[ Object.keys(anchor_nodes)[i] ]
      el.appendChild( text_nodes[ Object.keys(text_nodes)[i] ] )
      hex_frame.appendChild(el)
    }
    hexagrams_menu.appendChild(hex_frame)
    }
    data_index++
  })
}

set_dom()
