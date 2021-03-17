'use strict'

var hex_control = { current_hex : -1, current_collection: {} }
var hex_names = document.querySelectorAll('.hex-name')
var hex_modal = document.querySelector('#hex-modal')
var hex_modal_closer = document.querySelector('#close-hex-modal')
hex_names.forEach( function (hex_name_el) {

  hex_name_el.addEventListener('click', function (event) {
    var hex_collection = {}
    var current_hex = []
    var hex_index = -1
    var objs = [hex_builder.this_hex,hex_builder.next_hex]
    var props = ['first','second']
    props.forEach( function (prop) {
      hex_index = (props.indexOf(prop)!=-1) ?  props.indexOf(prop) : hex_index
      current_hex = (event.target.id===prop+'-hex-name' && hex_index>-1) ?
        objs[hex_index] : current_hex
    })
    console.log(current_hex)
    console.log(hex_builder)
    if (current_hex.length===6) {
      hex_collection = select_hex(current_hex,hex_builder.moving_lines,hex_index)
    //  hex_control.current_hex = el_index
      hex_collection.lines = hex_builder.moving_lines
      hex_control.current_collection = hex_collection
      render_modal_text(hex_collection)
      open_hex_modal()
    }

  })

})

hex_modal_closer.addEventListener('click',close_hex_modal)

function open_hex_modal() {
  hex_modal.style.display = 'flex'
  app_shell.style.opacity = 0.33
}

function close_hex_modal() {
  hex_modal.style.display = 'none'
  app_shell.style.opacity = 1
}

function select_hex(this_hex,moving_lines,arg) {
  var bin_str = this_hex.join()
  var hex_index = hex_bin_arr.indexOf(bin_str)
  var hex_names = (hex_index > -1) ? hex_name_arr[hex_index] : null
  var hex_content = {
    inner : {
      desc : purports_inner[hex_index],
      lines : function () {
        var result = []
        moving_lines.forEach( function (line_index) {
          result.push(moving_lines_inner[line_index])
        })
        return result
      }
    },
    outer : {
      desc : purports_outer[hex_index],
      lines :function () {
        var result = []
        moving_lines.forEach( function (line_index) {
          result.push(moving_lines_outer[line_index])
        })
        return result
      }
    }
  }
  return { name : hex_names, number: hex_index, articles: hex_content}
}

function render_modal_text(collection) {
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
  var names = collection.name.split(' | ')
  for (var i = 0; i < names.length; i++) {
    modal_dom[h+i].innerHTML = (i) ? names[i] : collection.number
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
          collection[side_key].lines().forEach( function (line_text) {
            var list_item = document.createElement('li')
            list_item.innerHTML = line_text
            list.appendChild(list_item)
            modal_dom.articles[side_key][text].appendChild(list)
          })
          break
        default :
          console.log('irregular data collection object')
      }
    })
  })

}
