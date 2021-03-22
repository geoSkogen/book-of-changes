'use strict'

var all_lines = document.querySelectorAll('.line-frame')
var hexname_els = document.querySelectorAll('.hex-name')
var hex_graph = {
lines_arr:  [
    [1,0,1,0,1,0],
    [0,1,0,1,0,1]
  ],
lines_els : [
    [],
    []
  ]
}
for (var i = 0; i < 6; i++) {
  hex_graph.lines_els[0] = all_lines[i]
  hex_graph.lines_els[1] = all_lines[i+6]
}

all_lines.forEach( function (line) {
  line.addEventListener('click', function (event) {
    toggle_line(line.id)
  })
})

function toggle_line(id_str) {
  var line_types = ['yin','yang']
  var line_frame = document.querySelector('#'+id_str)
  var id_arr = line_frame.id.split('-')
  var hex_index = Number(id_arr[id_arr.length-1])-1
  var old_line = line_frame.getAttribute('data-toggle')
  var new_line_type = (line_types.indexOf(old_line)) ? line_types[0] : line_types[1]
  var new_line = line_builder[new_line_type+'_line']()

  hex_graph.lines_arr[hex_index] = line_types.indexOf(new_line_type)
  line_frame.setAttribute('data-toggle',new_line_type)
  line_frame.innerHTML = ''
  line_frame.appendChild(new_line)

  console.log(hex_graph.lines_arr)
}

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
