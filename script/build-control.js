'use strict'
const build_control = {
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
    }
  },

  all_lines : document.querySelectorAll('.line-frame'),
  hexagram_menus : document.querySelectorAll('.meta-col'),
  hexagram_menu_tabs : document.querySelectorAll('.meta-col-tab'),

  line_builder : {
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
  },

  hex_graph : {
    lines_arr:  [
      [1,0,1,0,1,0],
      [0,1,0,1,0,1]
    ],
     moving_lines : [0,1,2,3,4,5],
     lines_els: [
       [], []
     ]
  },

  handle_line_click : function (line,line_id) {
    var id_arr = line_id.split('-')
    var hex_index = Number(id_arr[id_arr.length-1])-1
    var line_index = Number(id_arr[id_arr.length-2])-1
    // convert click target to opposite, resets array value
    if (line.id) { this.toggle_line(line,hex_index,line_index) }
    // calculate differences between the two arrays
    this.rerack_moving_lines()
    // find the names for each array and render them
    this.print_hex_headers()
    this.print_tri_headers()
    // show the arrow if two arrays are different
    if (this.hex_graph.moving_lines.length) {
      this.print_moving_icon(true) } else { this.print_moving_icon(false)
    }
  },

  handle_url_query : function (url_str) {
    var hex_num_arr = (url_str.split('#/')[1]) ?
      url_str.split('#/')[1].split('/') : []

    var hex_modal_index = (url_str.split('#/')[2]) ?
      Number( url_str.split('#/')[2].replace(/\//g,'') ) : null

    var is_query = hex_num_arr.length ? true : false

    if (is_query) {
      for (var i = 0; i < hex_num_arr.length; i++) {
        /*
        console.log(i)
        console.log(hex_num_arr)
        */
        var hex_data_index = Number(hex_num_arr[i]) ? Number(hex_num_arr[i]) : null
        var new_lines_arr = (hex_bin_arr[ hex_data_index ]) ? hex_bin_arr[ hex_data_index ].split('') : []
        /*
        console.log(new_lines_arr)
        console.log(hex_data_index)
        */
        if (hex_data_index!=null) {

          for (var ii = 0; ii< new_lines_arr.length; ii++) {
            if (this.hex_graph.lines_arr[i][ii] != new_lines_arr[ii]) {
              var line_index = (i) ? (5-ii)+6 : 5-ii
              this.handle_line_click(all_lines[line_index],all_lines[line_index].id)
            }
          }
        }
      }
      if (hex_modal_index!=null) {
        this.hex_names[hex_modal_index].click()
      }
    }
  },

  toggle_line : function (line_frame,hex_index,line_index) {
    var line_types = ['yin','yang']
    var old_line = line_frame.getAttribute('data-toggle')
    var new_line_type = (line_types.indexOf(old_line)) ? line_types[0] : line_types[1]
    var new_line = this.line_builder[new_line_type+'_line']()
    /*
    console.log('line_index')
    console.log(line_index)
    console.log('hex_index')
    console.log(hex_index)
    */
    line_frame.setAttribute('data-toggle',new_line_type)
    line_frame.innerHTML = ''
    line_frame.appendChild(new_line)

    this.hex_graph.lines_arr[hex_index][line_index] = line_types.indexOf(new_line_type)

  //  console.log(hex_graph.lines_arr)
  },

  rerack_moving_lines : function () {
    this.hex_graph.moving_lines = []
    for (var i = 0; i < 6; i++) {
      if (this.hex_graph.lines_arr[0][i]!=this.hex_graph.lines_arr[1][i]) {
        this.hex_graph.moving_lines.push(i)
      }
    }
  },

  get_hex_name : function (bin_arr) {
    var index = library.get_hex_index(bin_arr)
    var names = library.select_names(index)
    return names
  },

  print_hex_headers : function () {
    var hexname_els = document.querySelectorAll('.hex-name')
    var name_str = ''
    for (var i = 0; i < this.hex_graph.lines_arr.length; i++) {
      name_str = this.get_hex_name(this.hex_graph.lines_arr[i])
      name_str = (name_str) ? name_str.replace(/\s\|\s/g,'<br/>') : ''
      hexname_els[i].innerHTML = (name_str) ? name_str : hexname_els[i].innerHTML
    }
  },

  print_tri_headers : function () {
    var triname_els = document.querySelectorAll('.trigram')
    var tri_props = ['top','bottom']
    var index = 0

    for (var i = 0; i < this.hex_graph.lines_arr.length; i++) {
      var collection = {}
      collection = library.get_trigrams_from_hex(this.hex_graph.lines_arr[i])
      tri_props.forEach( function (tri_prop) {
        triname_els[index].innerHTML =
          collection[tri_prop].chars + '<br/>' + collection[tri_prop].names
        index++
      })
    }
  },

  print_moving_icon : function (arg) {
    var icon = document.querySelector('#hex-mover')
    icon.style.display=  (arg) ? 'block' : 'none'
  },

  clear_modal_content : function () {
    for (var i = 0 ; i < 4; i++) {
      this.modal_dom['h'+i].innerHTML = ''
    }
    Object.keys(this.modal_dom.articles).forEach( function (side_key) {
      Object.keys(build_control.modal_dom.articles[side_key]).forEach( function (content_key) {
        build_control.modal_dom.articles[side_key][content_key].innerHTML = ''
      })
    })
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
        build_control.hex_modal.style.display = 'block'
        build_control.hex_modal.style.opacity = '0'
        appear = setInterval( function () {

          n = build_control.raise_light(n)
          if (n>=1) {
            clearInterval(appear)
          }
        }, 21.32)
        document.querySelector('#app').style.opacity = 0.33
    }, 500 )
  },

  close_hex_modal : function () {
    build_control.hex_modal.style.display = 'none'
    document.querySelector('#app').style.opacity = 1
    build_control.clear_modal_content();
  },

  get_hex_collection : function (event) {
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
    var objs = [this.hex_graph.lines_arr[0],this.hex_graph.lines_arr[1]]
    var props = ['first','second']
    var descs = {}
    props.forEach( function (prop) {
      var el_prop = event.target.id.replace('-hex-name','')
      hex_index = (props.indexOf(el_prop)!=-1) ? props.indexOf(el_prop) : hex_index
      current_hex = (event.target.id===prop+'-hex-name' && hex_index>-1) ?
        objs[hex_index] : current_hex
    })
    //console.log(current_hex)
    //console.log(event.target.id)
    collection.number
     = library.get_hex_index(current_hex)
    collection.names = library.select_names(collection.number)
    descs = library.select_text(collection.number)
    collection.articles.inner.desc = descs.inner
    collection.articles.outer.desc = descs.outer
    collection.articles.inner.lines =
      library.select_moving_lines(collection.number,this.hex_graph.moving_lines,1)
    collection.articles.outer.lines =
      library.select_moving_lines(collection.number,this.hex_graph.moving_lines,0)
    return collection
  },

  render_modal_text : function (collection) {
    var names = (collection.names.length) ? collection.names.split(' | ') : []
    for (var i = 0; i < names.length+1; i++) {
      this.modal_dom['h'+i].innerHTML = (i) ? names[i-1] : collection.number
    }
    Object.keys(this.modal_dom.articles).forEach( function (side) {
      var side_key = side
      Object.keys(build_control.modal_dom.articles[side_key]).forEach( function (text) {
        switch (text) {
          case 'desc' :
            build_control.modal_dom.articles[side_key][text].innerHTML = collection.articles[side_key][text]
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
              build_control.modal_dom.articles[side_key][text].appendChild(list)
            }
            break
          default :
            console.log('irregular data collection object')
        }
      })
    })
  },

  toggle_tab : function (toggle_arg,id_str) {
    var next_arg = (toggle_arg) ? 0 : 1
    var props = { display: ['none','flex'], opacity:['0.72','1'] }
    var chars = [':',';']
    var index = Number(id_str.split('-')[id_str.split('-').length-1])-1
    var els = [this.hexagram_menus[index],this.hexagram_menu_tabs[index]]
    var style_strs = []
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

build_control.all_lines.forEach( function (line) {
  line.addEventListener('click', function (event) {
    build_control.handle_line_click(line,line.id)
  })
})

build_control.hex_names.forEach( function (hex_name_el) {
    //
  hex_name_el.addEventListener('click', function (event) {
      //
      var collection = build_control.get_hex_collection(event)
      build_control.render_modal_text(collection)
      build_control.open_hex_modal()
      build_control.toggle_tab('1','id-1')
  })//ends event listener function
})//ends hex iteration

build_control.hexagram_menu_tabs.forEach( function (menu_tab) {
  menu_tab.addEventListener('click', function (event) {
    build_control.toggle_tab( this.getAttribute('data-toggle'), this.id )
  })
})

document.querySelector('#close-hex-modal').addEventListener('click',build_control.close_hex_modal)

build_control.handle_line_click({},'')

build_control.handle_url_query(window.location.href)
