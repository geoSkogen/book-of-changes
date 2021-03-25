'use strict'

var menu = document.querySelector('#trigram-menu')
var links = document.querySelectorAll('.trigram-char')
var reset_icon = document.querySelector('#hex-refresh')
var tri_assembler = {
  trigrams : [null,null],
  select_handler : function (el) {
    var mode = Number(el.getAttribute('data-toggle'))
    var index = Number(el.getAttribute('data-index'))

    var props = [
      {'color' : 'cornflowerblue', 'background-color' : 'lightgrey', 'border-color' : 'cornflowerblue'},
      {'color' : 'red', 'background-color' : 'lightsteelblue', 'border-color' : 'red'},
      {'color'  : 'lightgrey', 'backround-color' : 'black', 'border-color' : 'lightgrey' }
    ]

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
    anchor.setAttribute('data-toggle','2')
    anchor.setAttribute('data-index',t)
    anchor.querySelector('.tri-lines-char').innerHTML = tri_lines_chars_arr[t]
    anchor.querySelector('.tri-lines-name').innerHTML = name
    if (arg) {
      anchor.addEventListener('click', function (event) {
        var active_el = this
        tri_assembler.select_handler(active_el)
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
