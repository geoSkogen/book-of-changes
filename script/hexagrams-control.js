'use strict'

var hexagram_menus = document.querySelectorAll('.hexagram-menu')
var hexagram_menu_tabs = document.querySelectorAll('.menu-tab')

var data_index = 0
var menu_index = 0
function set_dom () {
  hex_name_arr.forEach( function (hex_names) {
    if (data_index) {
    console.log(data_index)
    console.log(hex_chars_table[data_index][0])
    console.log(hex_lines_chars_arr[data_index])
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
    var classes = [
      'lines-frame',
      'name-frame',
      'char-frame'
    ]
    for (var i = 0; i < Object.keys(anchor_nodes).length;i++) {
      el = anchor_nodes[ Object.keys(anchor_nodes)[i] ]
      el.className = classes[i]
      el.appendChild( text_nodes[ Object.keys(text_nodes)[i] ] )
      hex_frame.className = 'hex-frame'
      hex_frame.appendChild(el)
    }
    hexagram_menus[menu_index].appendChild(hex_frame)
    }
    data_index++
    menu_index = (data_index>48) ? 2 : (data_index>24) ?  1 : 0
  })
}

function toggle_tab(toggle_arg,id_str) {
  var next_arg = (toggle_arg) ? 0 : 1
  var props = { display: ['none','flex'], opacity:['0.72','1'] }
  var chars = [':',';']
  var index = Number(id_str.split('-')[id_str.split('-').length-1])-1
  var els = [hexagram_menus[index],hexagram_menu_tabs[index]]
  var style_strs = []
  for (var i = 0; i < els.length; i++) {
    //console.log(i)
    //console.log(els[index])
    style_strs[i] = Object.keys(props)[i] + ':' + props[Object.keys(props)[i]][toggle_arg] + ';'
    els[i].setAttribute('style',style_strs[i])
    els[i].setAttribute('data-toggle',next_arg.toString())
  }
  // iterate all menu/tab pairs
  for (var j = 0; j < hexagram_menu_tabs.length;j++) {
    if (j!=index) {
      els = [hexagram_menus[j],hexagram_menu_tabs[j]]
      for (var ii = 0; ii < els.length; ii++) {
        style_strs[ii] = Object.keys(props)[ii] + ':' + props[Object.keys(props)[ii]][0] + ';'
        els[ii].setAttribute('style',style_strs[ii])
        els[ii].setAttribute('data-toggle','1')
      }
    }
  }
}

hexagram_menu_tabs.forEach( function (menu_tab) {
  menu_tab.addEventListener('click', function (event) {
    toggle_tab( this.getAttribute('data-toggle'), this.id )
  })
})

set_dom()

toggle_tab('1','id-1')
