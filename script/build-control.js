'use strict'

var hex_names = document.querySelectorAll('.hex-name')
var hex_modal = document.querySelector('#hex-modal')
var hex_modal_closer = document.querySelector('#close-hex-modal')
var hex_refresh_icon = document.querySelector('#hex-refresh')
var modal_dom = {
  h0 : document.querySelector('#hex-number'),
  h1 : document.querySelector('#hex-name-title'),
  h2 : document.querySelector('#hex-name-alt'),
  h3 : document.querySelector('#hex-name-mod'),
  articles : {
    inner : {
      desc: document.querySelector('#hex-meta-inner'),
      lines : document.querySelector('#moving-lines-inner')
    },
    outer : {
      desc: document.querySelector('#hex-meta-outer'),
      lines : document.querySelector('#moving-lines-outer')
    }
  }
}

var all_lines = document.querySelectorAll('.line-frame')

var line_builder = {
  yang_line :  function () {
    var line = document.createElement('div')
    line.className = "full-line"
    return line
  },
  yin_line : function () {
    var line_1 = document.createElement('div')
    var line_2 = document.createElement('div')
    var wrapper = document.createElement('div')
    wrapper.className = "half-line-frame flex-row flex-between"
    line_1.className = "half-line"
    line_2.className = "half-line"
    wrapper.appendChild(line_1)
    wrapper.appendChild(line_2)
    return wrapper
  }
}

var hex_graph = {
  lines_arr:  [
    [1,0,1,0,1,0],
    [0,1,0,1,0,1]
  ],
   moving_lines : [0,1,2,3,4,5],
   lines_els: [
     [], []
   ]
}
for (var i = 0; i < 6; i++) {
  //hex_graph.lines_els[0].id.push(all_lines[i])
  //hex_graph.lines_els[1].id.push(all_lines[i+6])
}

all_lines.forEach( function (line) {
  line.addEventListener('click', function (event) {
    handle_line_click(line,line.id)
  })
})

function handle_line_click(line,line_id) {
  var id_arr = line_id.split('-')
  var hex_index = Number(id_arr[id_arr.length-1])-1
  var line_index = Number(id_arr[id_arr.length-2])-1
  // convert click target to opposite, resets array value
  if (line.id) { toggle_line(line,hex_index,line_index) }
  // calculate differences between the two arrays
  rerack_moving_lines()
  // find the names for each array and render them
  print_hex_headers()
  print_tri_headers()
  // show the arrow if two arrays are different
  if (hex_graph.moving_lines.length) {
    print_moving_icon(true) } else { print_moving_icon(false)
  }
}

function toggle_line(line_frame,hex_index,line_index) {
  var line_types = ['yin','yang']
  var old_line = line_frame.getAttribute('data-toggle')
  var new_line_type = (line_types.indexOf(old_line)) ? line_types[0] : line_types[1]
  var new_line = line_builder[new_line_type+'_line']()
  console.log('line_index')
  console.log(line_index)
  console.log('hex_index')
  console.log(hex_index)
  line_frame.setAttribute('data-toggle',new_line_type)
  line_frame.innerHTML = ''
  line_frame.appendChild(new_line)

  hex_graph.lines_arr[hex_index][line_index] = line_types.indexOf(new_line_type)

  console.log(hex_graph.lines_arr)
}

function rerack_moving_lines() {
  hex_graph.moving_lines = []
  for (var i = 0; i < 6; i++) {
    if (hex_graph.lines_arr[0][i]!=hex_graph.lines_arr[1][i]) {
      hex_graph.moving_lines.push(i)
    }
  }
}

function get_hex_name(bin_arr) {
  var index = library.get_hex_index(bin_arr)
  var names = library.select_names(index)
  return names
}

function print_hex_headers() {
  var hexname_els = document.querySelectorAll('.hex-name')
  var name_str = ''
  for (var i = 0; i < hex_graph.lines_arr.length; i++) {
    name_str = get_hex_name(hex_graph.lines_arr[i])
    name_str = (name_str) ? name_str.replace(/\s\|\s/g,'<br/>') : ''
    hexname_els[i].innerHTML = (name_str) ? name_str : hexname_els[i].innerHTML
  }
}

function print_tri_headers() {
  var triname_els = document.querySelectorAll('.trigram')
  var tri_props = ['top','bottom']
  var index = 0

  for (var i = 0; i < hex_graph.lines_arr.length; i++) {
    var collection = {}
    collection = library.get_trigrams_from_hex(hex_graph.lines_arr[i])
    tri_props.forEach( function (tri_prop) {
      triname_els[index].innerHTML =
        collection[tri_prop].chars + '<br/>' + collection[tri_prop].names
      index++
    })
  }
}

function print_moving_icon(arg) {
  var icon = document.querySelector('#hex-mover')
  icon.style.display=  (arg) ? 'block' : 'none'
}

function clear_modal_content() {
  for (var i = 0 ; i < 4; i++) {
    modal_dom['h'+i].innerHTML = ''
  }
  Object.keys(modal_dom.articles).forEach( function (side_key) {
    Object.keys(modal_dom.articles[side_key]).forEach( function (content_key) {
      modal_dom.articles[side_key][content_key].innerHTML = ''
    })
  })
}

function open_hex_modal() {
  hex_modal.style.display = 'block'
  app_shell.style.opacity = 0.33
}

function close_hex_modal() {
  hex_modal.style.display = 'none'
  app_shell.style.opacity = 1
  clear_modal_content();
}

function get_hex_collection(event) {
  var collection = {
    number: -1,
    names: '',
    articles: {
      inner: { desc:'', lines:[] },
      outer: { desc:'', lines:[] }
    }
  }
  var current_hex = []
  var hex_index = -1
  var objs = [hex_graph.lines_arr[0],hex_graph.lines_arr[1]]
  var props = ['first','second']
  var descs = {}
  props.forEach( function (prop) {
    var el_prop = event.target.id.replace('-hex-name','')
    hex_index = (props.indexOf(el_prop)!=-1) ? props.indexOf(el_prop) : hex_index
    current_hex = (event.target.id===prop+'-hex-name' && hex_index>-1) ?
      objs[hex_index] : current_hex
  })
  console.log(current_hex)
  console.log(event.target.id)
  collection.number
   = library.get_hex_index(current_hex)
  collection.names = library.select_names(collection.number)
  descs = library.select_text(collection.number)
  collection.articles.inner.desc = descs.inner
  collection.articles.outer.desc = descs.outer
  collection.articles.inner.lines =
    library.select_moving_lines(collection.number,hex_graph.moving_lines,1)
  collection.articles.outer.lines =
    library.select_moving_lines(collection.number,hex_graph.moving_lines,0)
  return collection
}

function render_modal_text(collection) {
  var names = (collection.names.length) ? collection.names.split(' | ') : []
  for (var i = 0; i < names.length+1; i++) {
    modal_dom['h'+i].innerHTML = (i) ? names[i-1] : collection.number
  }
  Object.keys(modal_dom.articles).forEach( function (side) {
    var side_key = side
    Object.keys(modal_dom.articles[side_key]).forEach( function (text) {
      switch (text) {
        case 'desc' :
          modal_dom.articles[side_key][text].innerHTML = collection.articles[side_key][text]
          break
        case 'lines' :
          var list = document.createElement('ul')
          if (collection.articles[side_key][text].length) {
            collection.articles[side_key][text].forEach( function (line_text) {
              var line_text = document.createTextNode(line_text)
              var line_el = document.createElement('li')
              line_el.appendChild(line_text)
              line_el.className = 'moving-line-item'
              list.appendChild(line_el)
              list.className = 'moving-lines-list'
            })
            modal_dom.articles[side_key][text].appendChild(list)
          }
          break
        default :
          console.log('irregular data collection object')
      }
    })
  })
}

hex_names.forEach( function (hex_name_el) {
    //
  hex_name_el.addEventListener('click', function (event) {
      //
      var collection = get_hex_collection(event)
      render_modal_text(collection)
      open_hex_modal()
  })//ends event listener function
})//ends hex iteration

hex_modal_closer.addEventListener('click',close_hex_modal)

handle_line_click({},'')
