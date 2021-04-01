'use strict'

var hexagram_menus = document.querySelectorAll('.hexagram-menu')
var hexagram_menu_tabs = document.querySelectorAll('.menu-tab')
var hex_modal = document.querySelector('#hex-modal')
var hex_modal_closer = document.querySelector('#close-hex-modal')
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
        setTimeout(function(){ toggle_hex_modal() }, 500);
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
  var id_arr = (window.location.href.split('#/')[1]) ?
    window.location.href.split('#/')[1].split('/') : []
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
  var props = { display:['none','flex'], opacity:['0.72','1'] }
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

function collect_hex_data() {
  var id_arr = (window.location.href.split('#/')[1]) ?
    window.location.href.split('#/')[1].split('/') : []
  var collection = []
  for (var i=0; i<id_arr.length; i++) {
    if (id_arr[i]) {
      collection[i] = {}
      collection[i].number = id_arr[i]
      collection[i].names = library.select_names(collection[i].number)
      collection[i].char = library.select_char(collection[i].number,true,true)
      collection[i].pinyin = library.select_char(collection[i].number,true,false)
      collection[i].lines = hex_lines_chars_arr[collection[i].number]
    }
  }
  return collection
}

function raise_light(n) {
  hex_modal.style.opacity = n
  app_shell.style.opacity = 1-n
  n+=0.1
  return n
}

function render_hexagram_modal_text(collection) {
  var props = ['title','alt','mod']
  var collection_keys = []
  var names = []
  var this_key = ''
  for (var c = 0; c < collection.length; c++) {
    collection_keys = Object.keys(collection[c])
    for (var i = 0; i < collection_keys.length; i++) {
      console.log(  '#hex-' + this_key + '-' + (c+1).toString())
      this_key = Object.keys(collection[c])[i]
      if (this_key!='names') {
        document.querySelector(
          '#hex-' + this_key + '-' + (c+1).toString()
        ).innerHTML = collection[c][ this_key ]
      } else {
        names = collection[c].names.split(' | ')
        for (var ii = 0; ii < props.length; ii++) {
          document.querySelector(
            '#hex-name-' + props[i] + '-' + (c+1).toString()
          ).innerHTML = names[i]
        }
      }
    }
  }
  return true
}

function toggle_hex_modal() {
  var id_arr = (window.location.href.split('#/')[1]) ?
    window.location.href.split('#/')[1].split('/') : []
  var collection = collect_hex_data()
  var n = 0
  var appear
  if (collection.length) {
    console.log(collection)
    appear = setInterval( function () {
      hex_modal.style.display = 'block'
      hex_modal.style.opacity = '1'
      n = raise_light(n)
      if (n>=1) {
        clearInterval(appear)
      }
    }, 21.32)
    render_hexagram_modal_text(collection)
  }
}

function clear_hex_modal() {
  document.querySelectorAll('.hex-title').forEach( function (title_el) {
    title_el.innerHTML = ''
  })
}

function close_hex_modal() {
  hex_modal.style.display = 'none'
  app_shell.style.opacity = 1
  clear_hex_modal()
  //clear_modal_content();
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

hex_modal_closer.addEventListener('click',close_hex_modal)

set_dom()

toggle_tab('1','id-1')

toggle_hex_modal()
