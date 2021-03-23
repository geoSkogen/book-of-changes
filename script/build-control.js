'use strict'

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

handle_line_click({},'')
