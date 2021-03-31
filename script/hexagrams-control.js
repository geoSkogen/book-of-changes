'use strict'

var hexagram_menus = document.querySelectorAll('.hexagram-menu')
var hexagram_menu_tabs = document.querySelectorAll('.menu-tab')
var filter_icon = document.querySelector('#hex-filter')
var top_state = 0;
var data_index = 0
var menu_index = 0
function set_dom () {
  hex_name_arr.forEach( function (hex_names) {
    if (data_index) {
    //console.log(data_index)
    //console.log(hex_chars_table[data_index][0])
    //console.log(hex_lines_chars_arr[data_index])
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
        hex_frame.appendChild(el)
      }
      hex_frame.className = 'hex-frame'
      hex_frame.id = data_index.toString()
      hex_frame.href = '#/' + data_index.toString() + '/'
      hex_frame.setAttribute('data-toggle',0)
      hex_frame.addEventListener('click', function (event) {
        inject_hrefs(this.href,this.id)
        inject_title_text()
      })
      hexagram_menus[menu_index].appendChild(hex_frame)
    }
    data_index++
    menu_index = (data_index>48) ? 3 :
      (data_index>32) ? 2 :
        (data_index>16) ? 1 :
          0
  })
}

function inject_title_text() {
  var id_arr = (window.location.href.split('/#/')[1]) ?
    window.location.href.split('/#/')[1].split('/') : []
  var names_arr = []
  var title_str = ''
  if (id_arr.length && !id_arr[id_arr.length-1]) {
    id_arr.pop()
  }
  id_arr.forEach( function(id_str) {
    var names = library.select_names(Number(id_str))
    title_str += names + ' - '
  })
  document.querySelector('title').innerHTML = title_str
}

function inject_hrefs(url_str,id_str) {
  var anchors = document.querySelectorAll('.hex-frame')
  var id_arr = (window.location.href.split('#/')[1]) ?
    window.location.href.split('#/')[1].split('/') : []
  //if (id_str===id_arr[0]) {   }
  anchors.forEach( function (anchor) {
    var toggle = Number( anchor.getAttribute('data-toggle') )
    var this_uri = '#/' + anchor.id + '/'
    var urri = url_str + anchor.id + '/'
    var next_href = (anchor.id === id_str) ? this_uri : urri
    var inject_href = (toggle) ? ( (toggle > 1) ? this_uri : anchor.href ) : next_href
    anchor.href = ''
    anchor.href = inject_href
    toggle += (toggle>1) ? -2 : 1
    anchor.setAttribute('data-toggle',toggle.toString())
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

function toggle_hexagram_modal(collection) {
  for (var i = 0; i < Object.keys(collection).length; i++) {

  }
}

function toggle_filter_menu(self,arg) {
  var props = ['none','block']
  var select = document.querySelector('#filter-menu')
  var next_arg = (arg) ? 0 : 1
  select.style.display = props[arg]
  self.setAttribute('data-toggle',next_arg.toString())
}

hexagram_menu_tabs.forEach( function (menu_tab) {
  menu_tab.addEventListener('click', function (event) {
    toggle_tab( this.getAttribute('data-toggle'), this.id )
  })
})

filter_icon.addEventListener('click', function (event) {
  var arg = Number(this.getAttribute('data-toggle'))
  toggle_filter_menu(this,arg)
})

set_dom()

toggle_tab('1','id-1')
