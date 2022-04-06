'use strict'
/**
* Imports library from hex-control
* Imports hex_builder from touch-wheel
*
* Exports throw_control object
* Exports global functions: open_hex_modal, close_hex_modal, render_modal_text, clear_modal_content, reset_hexes, get_hex_collection, toggle_tab, raise_light
*/
const throw_control = {
  hex_names : document.querySelectorAll('.hex-name'),
  hex_modal : document.querySelector('#hex-modal'),
  modal_dom : {
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
    },
  },
  hexagram_menus : document.querySelectorAll('.meta-col'),
  hexagram_menu_tabs : document.querySelectorAll('.meta-col-tab'),

  reset_hexes : function () {
    let hexes = [hex_builder.graph,hex_builder.regraph]
    let hex_bins = []
    for (var i = 0; i < hexes.length; i++) {
      this.hex_names[i].innerHTML = ''
      hexes[i].innerHTML = ''
    }
    document.querySelector('#hex-mover').style.display = 'none'
    hex_builder.this_hex = []
    hex_builder.next_hex = []
    hex_builder.moving_lines = []
  },

  raise_light : function (n) {
    this.hex_modal.style.opacity = n
    document.querySelector('#app').style.opacity = 1-n
    n+=0.1
    return n
  },

  open_hex_modal : function () {
    var n = 0
    var appear
    setTimeout( function() {
      throw_control.hex_modal.style.display = 'block'
      throw_control.hex_modal.style.opacity = '0'
      appear = setInterval( function () {

        n = throw_control.raise_light(n)

        if (n>=1) { clearInterval(appear) }

      }, 21.32)

      document.querySelector('#app').style.opacity = 0.33
    }, 500 )
  },

  close_hex_modal : function () {
    throw_control.hex_modal.style.display = 'none'
    document.querySelector('#app').style.opacity = 1
    throw_control.clear_modal_content();
  },

  clear_modal_content : function () {
    for (var i = 0 ; i < 4; i++) {
      this.modal_dom['h'+i].innerHTML = ''
    }
    Object.keys(this.modal_dom.articles).forEach( function (side_key) {
      Object.keys(throw_control.modal_dom.articles[side_key]).forEach( function (content_key) {
        throw_control.modal_dom.articles[side_key][content_key].innerHTML = ''
      })
    })
  },

  get_hex_collection : function (event) {
     // using hex-data.library
    const collection = {
      number: -1,
      names: '',
      articles: {
        inner: { desc:'', lines:[] },
        outer: { desc:'', lines:[] }
      }
    }
    var current_hex = []
    var hex_index = -1
    var objs = [hex_builder.this_hex,hex_builder.next_hex]
    var props = ['first','second']
    var descs = {}
    props.forEach( function (prop) {
      var el_prop = event.target.id.replace('-hex-name','')
      hex_index = (props.indexOf(el_prop)!=-1) ? props.indexOf(el_prop) : hex_index
      current_hex = (event.target.id===prop+'-hex-name' && hex_index>-1) ?
        objs[hex_index] : current_hex
    })
     /*
     console.log(current_hex)
     console.log(event.target.id)
     */
    collection.number = library.get_hex_index(current_hex)
    collection.names = library.select_names(collection.number)
    descs = library.select_text(collection.number)
    collection.articles.inner.desc = descs.inner
    collection.articles.outer.desc = descs.outer
    collection.articles.inner.lines = event.target.id==='first-hex-name' ?
      library.select_moving_lines(collection.number,hex_builder.moving_lines,1) : []
    collection.articles.outer.lines = event.target.id==='first-hex-name' ?
      library.select_moving_lines(collection.number,hex_builder.moving_lines,0) : []
    return collection
  },

  render_modal_text : function (collection) {
    var names = (collection.names.length) ? collection.names.split(' | ') : []
    const dom_objects = this.modal_dom
    for (var i = 0; i < names.length+1; i++) {
      dom_objects['h'+i].innerHTML = (i) ? names[i-1] : collection.number
    }
    Object.keys(dom_objects.articles).forEach( function (side) {
      var side_key = side
      Object.keys(dom_objects.articles[side_key]).forEach( function (text) {
        switch (text) {
          case 'desc' :
            dom_objects.articles[side_key][text].innerHTML = collection.articles[side_key][text]
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
              dom_objects.articles[side_key][text].appendChild(list)
            }
            break
          default :
            console.log('irregular data collection object')
        }
      })
    })
  },

  toggle_tab : function (toggle_arg,id_str) {
    const next_arg = (toggle_arg) ? 0 : 1
    const props = { display: ['none','flex'], opacity:['0.72','1'] }
    const chars = [':',';']
    const index = Number(id_str.split('-')[id_str.split('-').length-1])-1
    var els = [this.hexagram_menus[index],this.hexagram_menu_tabs[index]]
    const style_strs = []
    for (var i = 0; i < els.length; i++) {
       //console.log(i)
       //console.log(els[index])
      style_strs[i] = Object.keys(props)[i] + ':' + props[Object.keys(props)[i]][toggle_arg] + ';'
      els[i].setAttribute('style',style_strs[i])
      els[i].setAttribute('data-toggle',next_arg.toString())
    }
     // iterate all menu/tab pairs
    for (var j = 0; j < this.hexagram_menu_tabs.length;j++) {
      if (j!=index) {
        els = [this.hexagram_menus[j],this.hexagram_menu_tabs[j]]
        for (var ii = 0; ii < els.length; ii++) {
          style_strs[ii] = Object.keys(props)[ii] + ':' + props[Object.keys(props)[ii]][0] + ';'
          els[ii].setAttribute('style',style_strs[ii])
          els[ii].setAttribute('data-toggle','1')
        }
      }
    }
  }
}

document.querySelector('#hex-refresh').addEventListener('click', function (event) {
  throw_control.reset_hexes()
})

throw_control.hex_names.forEach( function (hex_name_el) {

  hex_name_el.addEventListener('click', function (event) {
    if (hex_builder.this_hex.length===6) {
      const collection = throw_control.get_hex_collection(event)
      throw_control.render_modal_text(collection)
      throw_control.open_hex_modal()
      throw_control.toggle_tab('1','id-1')
    }// adds hexagram conditional
  })//ends event listener function
})//ends hex iteration

throw_control.hexagram_menu_tabs.forEach( function (menu_tab) {
  menu_tab.addEventListener('click', function (event) {
    throw_control.toggle_tab( this.getAttribute('data-toggle'), this.id )
  })
})

document.querySelector('#close-hex-modal').addEventListener('click',throw_control.close_hex_modal)
