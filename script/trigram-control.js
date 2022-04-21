'use strict'

/**
*  Imports tri_bin_arr from hex-data
*  Imports library from hex-control
*
*  Exports tri_assembler object
*/

const tri_assembler = {
  links : document.querySelectorAll('.trigram-char'),
  hex_modal : document.querySelector('#hex-modal'),
  modal_dom : {
    h0 : document.querySelector('#hex-number'),
    h1 : document.querySelector('#hex-name-title'),
    h2 : document.querySelector('#hex-name-alt'),
    h3 : document.querySelector('#hex-name-mod')
  },
  icon : document.querySelector('#tri-hex'),
  sides : ['top','bottom'],
  trigrams : [null,null,null],
  select_handler : function (el) {
    // mode corresponds to top[1] or bottom[2] trigram -- or no trigram[0]
    let mode = Number(el.getAttribute('data-toggle'))
    let index = Number(el.getAttribute('data-index'))

    const props = [
      {'color'  : 'lightgrey', 'background-color' : 'black', 'border-color' : 'lightgrey' },
      {'color' : 'cornflowerblue', 'background-color' : 'lightgrey', 'border-color' : 'cornflowerblue'},
      {'color' : 'red', 'background-color' : 'lightsteelblue', 'border-color' : 'red'},
    ]

    let style_prop_index, data_val, data_index

    if (mode) {
      // clicking a selected element nullifies it - array element at data_index is data_val
      style_prop_index = 0
      data_val = null
      data_index = mode
    } else {
      style_prop_index = this.trigrams[1] ? 2 : 1
      data_val = index
      data_index = style_prop_index
    }

    if (this.trigrams[2] && this.trigrams[1] &&
        this.trigrams.indexOf(index)<0 && this.trigrams[2] != this.trigrams[1]) {
      return
    } else {
      el.setAttribute('data-toggle',style_prop_index)

      this.trigrams[data_index] = data_val
      if (data_index===1) {
        this.trigrams[2] = data_val
      }

      this.toggle_trigram(index-1,props[style_prop_index])

      console.log(tri_assembler.trigrams)
    }
  },

  toggle_trigram : function (el_index,prop_obj) {
    let this_style = ''
    let parent_style = ''
    const propkeys = Object.keys(prop_obj)
    //console.log(prop_obj)
    for (var i = 0; i < propkeys.length; i++) {
      if (i<2) {
        this_style += propkeys[i] + ':' + prop_obj[propkeys[i]] + ';'
      } else {
        parent_style += propkeys[i] + ':' + prop_obj[propkeys[i]] + ';'
      }
    }
    this.links[el_index].setAttribute('style',this_style)
    this.links[el_index].parentElement.setAttribute('style',parent_style)
  },

  reset_model : function () {
    this.trigrams = [null,null]
  },

  toggle_hex_icon : function (arg) {
    const props = ['none','block']
    this.icon.style.display = props[arg]
  },

  build_hex_icon : function() {
    let sides_index = 0;
    const bin_arr = [
      tri_bin_arr[this.trigrams[2]-1].split('').reverse(),
      tri_bin_arr[this.trigrams[1]-1].split('').reverse()
    ]
    const liner = {
      '0' : function (arg) {
        const class_str = 'tri-hex-line yin-wrap flex-row flex-between'
        const wrapper = document.createElement('div')
        const line_els = [
          document.createElement('div'),
          document.createElement('div')
        ]
        line_els.forEach( function (line_el) {
          const this_class = 'half-yin tri-' + tri_assembler.sides[arg]
          line_el.className = this_class
          wrapper.appendChild(line_el)
        })
        wrapper.className = class_str
        return wrapper
      },
      '1' : function (arg) {
        const class_str = 'tri-hex-line tri-' + tri_assembler.sides[arg]
        const el = document.createElement('div')
        el.className = class_str
        return el
      }
    }
    this.icon.innerHTML=''
    bin_arr.forEach( function (tri_arr) {
      //
      tri_arr.forEach( function (line_val) {
        const line_el = liner[line_val](sides_index)
        tri_assembler.icon.appendChild(line_el)
      })
      sides_index++
    })
  },

  set_dom : function (arg) {
  // populates dom with text content & html attributes
    for (var t = 0; t < this.links.length; t++) {
      const anchor = this.links[t]
      const name = tri_names_arr[t][0]
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
          t,{'color': 'lightgrey', 'background-color': 'black', 'border-color': 'lightgrey' }
        )
      }
    }
  },

  render_modal_text : function (collection) {
    var names_arr = collection.names.split('|')
    var data_str = ''
    for (var i = 0; i < Object.keys(this.modal_dom).length; i++) {
      //
      data_str = (i) ? names_arr[i-1] :  collection.number + ': ' + collection.char
      this.modal_dom[Object.keys(this.modal_dom)[i]].innerHTML = data_str
    }
  },

  raise_light : function (n) {
    tri_assembler.hex_modal.style.opacity = n
    document.querySelector('#app').style.opacity = 1-n
    n+=0.1
    return n
  },

  open_hex_modal : function () {
    var n = 0
    var appear
    setTimeout( function() {
        tri_assembler.hex_modal.style.display = 'block'
        tri_assembler.hex_modal.style.opacity = '0'
        appear = setInterval( function () {

          n = tri_assembler.raise_light(n)
          if (n>=1) {
            clearInterval(appear)
          }
        }, 21.32)
        document.querySelector('#app').style.opacity = 0.33
        tri_assembler.icon.style.display = 'none'
    }, 500 )
  },

  close_hex_modal : function () {
    tri_assembler.hex_modal.style.display = 'none'
    document.querySelector('#app').style.opacity = 1
    tri_assembler.icon.style.display = 'block'
    //clear_modal_content();
  },

  get_hex_collection : function (hex_bin_arr) {
    // Using library from hex-control
    const collection = {
      number: -1,
      char:'',
      names: ''
    }
    collection.number
     = library.get_hex_index(hex_bin_arr)
    collection.char = library.select_char(collection.number,1,1)
    collection.names = library.select_names(collection.number)
    return collection
  }
}

document.querySelector('#hex-refresh').addEventListener('click', function () {
  tri_assembler.set_dom(false)
  tri_assembler.reset_model()
})

tri_assembler.icon.addEventListener('click', function (event) {
  var hex_bin_str = tri_bin_arr[tri_assembler.trigrams[1]-1] +
    tri_bin_arr[tri_assembler.trigrams[2]-1]
  //console.log(hex_bin_str)
  var collection = tri_assembler.get_hex_collection(hex_bin_str.split(','))
  //console.log(collection)
  tri_assembler.render_modal_text(collection)
  tri_assembler.open_hex_modal()
})//ends event listener function

document.querySelector('#close-hex-modal').addEventListener('click',tri_assembler.close_hex_modal)

tri_assembler.set_dom(true)
