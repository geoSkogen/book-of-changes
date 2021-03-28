'use strict'

var menu = document.querySelector('#trigram-menu')
var links = document.querySelectorAll('.trigram-char')
var reset_icon = document.querySelector('#hex-refresh')
var sides = ['top','bottom']

var tri_assembler = {
  trigrams : [null,null,null],
  icon : document.querySelector('#tri-hex'),
  select_handler : function (el) {
    var mode = Number(el.getAttribute('data-toggle'))
    var index = Number(el.getAttribute('data-index'))

    var props = [
      {'color'  : 'lightgrey', 'backround-color' : 'black', 'border-color' : 'lightgrey' },
      {'color' : 'cornflowerblue', 'background-color' : 'lightgrey', 'border-color' : 'cornflowerblue'},
      {'color' : 'red', 'background-color' : 'lightsteelblue', 'border-color' : 'red'},
    ]

    var data_offset = (mode) ?  0 : (this.trigrams[1]) ? 2 : 1

    var data_val = (mode) ? null : index

    var data_index = (mode) ? mode : data_offset
    if (this.trigrams[2] && this.trigrams[1] &&
        this.trigrams.indexOf(index)<0) {
      return
    } else {
      el.setAttribute('data-toggle',data_offset)

      this.trigrams[data_index] = data_val

      this.toggle_trigram(index-1,props[data_offset])

      console.log(tri_assembler.trigrams)
    }
  },

  toggle_trigram : function (el_index,prop_obj) {
    var this_style = ''
    var parent_style = ''
    var propkeys = Object.keys(prop_obj)
    //console.log(prop_obj)
    for (var i = 0; i < propkeys.length; i++) {
      if (i<2) {
        this_style += propkeys[i] + ':' + prop_obj[propkeys[i]] + ';'
      } else {
        parent_style += propkeys[i] + ':' + prop_obj[propkeys[i]] + ';'
      }
    }
    links[el_index].setAttribute('style',this_style)
    links[el_index].parentElement.setAttribute('style',parent_style)
  },

  reset_model : function () {
    this.trigrams = [null,null]
  },

  toggle_hex_icon : function (arg) {
    var props = ['none','block']
    this.icon.style.display = props[arg]
  },

  build_hex_icon : function() {
    var sides_index = 0;
    var bin_arr = [
      tri_bin_arr[this.trigrams[2]-1].split('').reverse(),
      tri_bin_arr[this.trigrams[1]-1].split('').reverse()
    ]
    var liner = {
      '0' : function (arg) {
        var class_str = 'tri-hex-line yin-wrap flex-row flex-between'
        var wrapper = document.createElement('div')
        var line_els = [
          document.createElement('div'),
          document.createElement('div')
        ]
        line_els.forEach( function (line_el) {
          var this_class = 'half-yin tri-' + sides[arg]
          line_el.className = this_class
          wrapper.appendChild(line_el)
        })
        wrapper.className = class_str
        return wrapper
      },
      '1' : function (arg) {
        var class_str = 'tri-hex-line tri-' + sides[arg]
        var el = document.createElement('div')
        el.className = class_str
        return el
      }
    }
    this.icon.innerHTML=''
    bin_arr.forEach( function (tri_arr) {
      //
      tri_arr.forEach( function (line_val) {
        var line_el = liner[line_val](sides_index)
        tri_assembler.icon.appendChild(line_el)
      })
      sides_index++
    })
  }
}

function set_dom(arg) {
// populates dom with text content & html attributes
  for (var t = 0; t < links.length; t++) {
    var anchor = links[t]
    var name = tri_names_arr[t][0]
    anchor.parentElement.id = name
    anchor.id = name + '-link'
    anchor.href += name
    anchor.setAttribute('data-toggle','0')
    anchor.setAttribute('data-index',t+1)
    anchor.querySelector('.tri-lines-char').innerHTML = tri_lines_chars_arr[t]
    anchor.querySelector('.tri-lines-name').innerHTML = name
    if (arg) {
      anchor.addEventListener('click', function (event) {
        var active_el = this
        tri_assembler.select_handler(active_el)
        if (tri_assembler.trigrams[1]!=null&&null!=tri_assembler.trigrams[2]) {
          tri_assembler.toggle_hex_icon(1)
          tri_assembler.build_hex_icon()
        } else {
          tri_assembler.toggle_hex_icon(0)
        }
      })
    } else {
      tri_assembler.toggle_trigram(
        t,{'color': 'lightgrey', 'backround-color': 'black', 'border-color': 'lightgrey' }
      )
    }
  }
}


reset_icon.addEventListener('click', function () {
  set_dom(false)
  tri_assembler.reset_model()
})


set_dom(true)
