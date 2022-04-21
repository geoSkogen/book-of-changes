'use strict'

/**
* Imports hex_name_arr, hex_bin_arr, tri_bin_arr from hex-data
* Imports library from hex-control
* Imports hex_lines_chars_arr, hex_names, hex_chars_table from /resources/hex-chars
*
* Exports hex_assembler object
*/

const hex_assembler = {
  hexagram_menus : document.querySelectorAll('.hexagram-menu'),
  hexagram_menu_tabs : document.querySelectorAll('.menu-tab'),
  hex_modal : document.querySelector('#hex-modal'),
  filter_icon : document.querySelector('#hex-filter'),
  filter_menu : document.querySelector('#filter-menu'),
  filter_modal : document.querySelector('#filter-tooltip'),
  filter_submit : document.querySelector('#filter-submit'),
  init : function () {
    this.set_dom()

    this.toggle_tab('1','id-1')

    this.toggle_hex_modal()
  },

  set_dom : function  () {
    // Using hex_name_arr from hex-data
    // Using hex_lines_chars_arr, hex_names, hex_chars_table from /resources/hex-chars
    let data_index = 0
    let menu_index = 0
    hex_name_arr.forEach( function (hex_names) {
      if (data_index) {
      //console.log(data_index)
      //console.log(hex_chars_table[data_index][0])
      //console.log(hex_lines_chars_arr[data_index])
        var el = {}
        const hex_frame = document.createElement('a')
        const anchor_nodes = {
          lines_frame : document.createElement('div'),
          name_frame : document.createElement('div'),
          char_frame : document.createElement('div')
        }
        const text_nodes = {
          lines_text : document.createTextNode(hex_lines_chars_arr[data_index]),
          name_text : document.createTextNode(hex_names),
          char_text : document.createTextNode(hex_chars_table[data_index][0]),
        }
        const classes = [
          'lines-frame',
          'name-frame',
          'char-frame'
        ]
        for (let i = 0; i < Object.keys(anchor_nodes).length;i++) {
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
          hex_assembler.inject_hrefs(this.href,this.id)
          hex_assembler.inject_title_text()
          setTimeout(function(){ hex_assembler.toggle_hex_modal() }, 500);
        })
        hex_assembler.hexagram_menus[menu_index].appendChild(hex_frame)
      }
      data_index++
      menu_index = (data_index>48) ? 3 :
        (data_index>32) ? 2 :
          (data_index>16) ? 1 :
            0
    })
  },

  filter_dom : function (filter_arr) {
    const hex_frames = document.querySelectorAll('.hex-frame')
    const these_frames = []
    if (filter_arr.length) {
      for (var i = 0; i < hex_frames.length; i++) {
        if (filter_arr.indexOf(i+1) > -1) {
          these_frames.push(hex_frames[i])
        }
      }
    }
    return these_frames
  },

  filter_by_trigram : function (tri_index,side_index) {
    // Using hex_bin_arr, tri_bin_arr from hex-data
    const result = []
    let stage_str = ''
    const begin_slice = Number(side_index) ? 3 : 0
    const end_slice = Number(side_index) ? 6 : 3
    for (let i = 0; i < hex_bin_arr.length-1; i++) {
      stage_str = hex_bin_arr[i].slice(begin_slice,end_slice)
      if (stage_str === tri_bin_arr[tri_index]) {
        result.push(i)
        /*
        console.log('staged_hex_segment:')
        console.log(stage_str)
        console.log('selected_bin_str')
        console.log(tri_bin_arr[tri_index])
        console.log("pushed "+ (i).toString() +"\r\n")
        */
      }
    }
    //console.log(result)
    return result
  },

  reset_filtered_dom : function (els_arr) {
    let hex_menu_index = 0;

    this.hexagram_menus.forEach( function (menu) {
      menu.innerHTML = ''
    })
    //console.log(els_arr)
    for(let i = 0; i < els_arr.length; i++) {
      this.hexagram_menus[hex_menu_index].appendChild(els_arr[i])
      hex_menu_index = (i>48) ? 3 : (i>32) ? 2 : (i>16) ? 1 : 0
    }

    for (let i = hex_menu_index; i < this.hexagram_menu_tabs.length; i++) {
      this.hexagram_menu_tabs[i].style.display = 'none'
    }

    document.querySelector('#hexagram-menu-tabs').style.display = 'none'
    document.querySelectorAll('.hexagram-menu').forEach( (menu) => {
      menu.style.marginTop = '4.25em';
    })
  },

  reset_default_dom : function () {
    document.querySelector('#hexagram-menu-tabs').style.display = 'flex'
    this.hexagram_menu_tabs.forEach( function (menu_tab) {
      menu_tab.style.display = 'block'
    })
    this.hexagram_menus.forEach( function (menu) {
      menu.innerHTML = ''
    })
    this.set_dom()
    this.toggle_tab('1','id-1')
  },

  triage_hex_filter : function (arg) {
    // Using sovereign_indices, inner_indices from hex_data
    var result = []
    const filters = [
      null,
      sovereign_indices,
      inner_indices,
      [1,2,63,64],
      []
    ]
    const procs = {
      4 : function () {
        hex_assembler.open_trigram_filter_modal()
      }
    }

    this.reset_default_dom()

    if (!isNaN(arg) && filters[arg]) {

      if (!filters[arg].length) {

        procs[arg]()

      } else {
        if (Number(arg)) {
          result = this.filter_dom(filters[arg])
          this.reset_filtered_dom(result)
        } else {
          this.reset_default_dom()
        }
      }
    }
  },

  open_trigram_filter_modal : function () {
    document.querySelector('#app').style.opacity = '0.33'
    this.filter_menu.style.opacity = '0.16'
    this.filter_modal.style.display = 'block'
  },

  close_trigram_filter_modal : function () {
    document.querySelector('#app').style.opacity = '1'
    this.filter_menu.style.opacity = '1'
    this.filter_modal.style.display = 'none'
  },

  inject_title_text : function () {
    const id_arr = (window.location.href.split('#/')[1]) ?
      window.location.href.split('#/')[1].split('/') : []
    const names_arr = []
    let title_str = ''
    if (id_arr.length && !id_arr[id_arr.length-1]) {
      id_arr.pop()
    }
    id_arr.forEach( function(id_str) {
      var names = library.select_names(Number(id_str))
      title_str += names + ' - '
    })
    document.querySelector('title').innerHTML = title_str
  },

  inject_hrefs : function (url_str,id_str) {
    const anchors = document.querySelectorAll('.hex-frame')
    const id_arr = (window.location.href.split('#/')[1]) ?
      window.location.href.split('#/')[1].split('/') : []
    //if (id_str===id_arr[0]) {   }
    anchors.forEach( function (anchor) {
      let toggle = Number( anchor.getAttribute('data-toggle') )
      const this_uri = '#/' + anchor.id + '/'
      var urri = url_str + anchor.id + '/'
      const next_href = (anchor.id === id_str) ? this_uri : urri
      const inject_href = (toggle) ? ( (toggle > 1) ? this_uri : anchor.href ) : next_href
      anchor.href = ''
      anchor.href = inject_href
      toggle += (toggle>1) ? -2 : 1
      anchor.setAttribute('data-toggle',toggle.toString())
    })
  },

  toggle_tab : function (toggle_arg,id_str) {
    const next_arg = (toggle_arg) ? 0 : 1
    const props = { display:['none','flex'], opacity:['0.72','1'] }
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
  },

  collect_hex_data : function () {
    const id_arr = (window.location.href.split('#/')[1]) ?
      window.location.href.split('#/')[1].split('/') : []
    const collection = []
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
  },

  raise_light : function (n) {
    this.hex_modal.style.opacity = n
    document.querySelector('#app').style.opacity = 1-n
    n+=0.1
    return n
  },

  render_hexagram_modal_text : function (collection) {
    var props = ['title','alt','mod']
    var collection_keys = []
    var names = []
    var this_key = ''
    var this_name = ''
    var inner_path = ''
    var innermost_path = ''
    var build_path = ''

    for (var c = 0; c < collection.length; c++) {
      if (c<2) {
      collection_keys = Object.keys(collection[c])
      for (var i = 0; i < collection_keys.length; i++) {
        //console.log(  '#hex-' + this_key + '-' + (c+1).toString())
        this_key = Object.keys(collection[c])[i]
        if (this_key!='names') {
          document.querySelector(
            '#hex-' + this_key + '-' + (c+1).toString()
          ).innerHTML = collection[c][ this_key ]
        } else {
          names = collection[c].names.split(' | ')
          for (var ii = 0; ii < props.length; ii++) {
            document.querySelector(
              '#hex-name-' + props[ii] + '-' + (c+1).toString()
            ).innerHTML = names[ii]
          }
        }
      }// ends collection keys loop
      //console.log(c)
      this_name = (c) ?
          collection[c-1].names.split(' | ')[0]+"&nbsp;&raquo;&nbsp;"+names[0] :
          names[0]

      build_path = (c) ?
        collection[c-1].number + '/' + collection[c].number + '/#/1' :
        collection[c].number + '/#/0'

      inner_path = (c) ?
        library.get_inner_hex(Number(collection[c-1].number)) + '/' +
        library.get_inner_hex(Number(collection[c].number)) :
        library.get_inner_hex(Number(collection[c].number))

      innermost_path = (c) ?
        library.get_inner_hex(
          library.get_inner_hex(Number(collection[c-1].number))
        ) + '/' + library.get_inner_hex(
          library.get_inner_hex(Number(collection[c].number))
        ) : library.get_inner_hex(
          library.get_inner_hex(Number(collection[c].number))
        )
      /*
      console.log(this_name)
      console.log(library.get_inner_hex(45))
      */
      if ( document.querySelector( '#read-link-' + (c+1).toString() ) ) {
        document.querySelector( '#read-link-' + (c+1).toString() ).innerHTML = 'read about ' + this_name
        document.querySelector( '#read-link-' + (c+1).toString() ).href = '../build/#/' + build_path
      }
      if ( document.querySelector( '#inner-link-' + (c+1).toString() ) ) {
        document.querySelector( '#inner-link-' + (c+1).toString() ).href = '#/' + inner_path
       document.querySelector( '#inner-link-' + (c+1).toString() ).
          addEventListener('click', function () { var mytoggle = setTimeout(toggle_hex_modal,100) })
      }
      if ( document.querySelector( '#innermost-link-' + (c+1).toString() ) ) {
        document.querySelector( '#innermost-link-' + (c+1).toString() ).href = '#/' + innermost_path
        document.querySelector( '#innermost-link-' + (c+1).toString() ).
          addEventListener('click', function () { var mytoggle = setTimeout(toggle_hex_modal,100) })
      }
    } // ends index conditional - less than two
    }// ends hex loop
    return true
  },

  toggle_hex_modal : function () {
    const id_arr = (window.location.href.split('#/')[1]) ?
      window.location.href.split('#/')[1].split('/') : []
    const collection = hex_assembler.collect_hex_data()
    var n = 0
    var appear
    if (collection.length) {
      //console.log(collection)
      appear = setInterval( function () {
        hex_assembler.hex_modal.style.display = 'block'
        hex_assembler.hex_modal.style.opacity = '1'
        n = hex_assembler.raise_light(n)
        if (n>=1) {
          clearInterval(appear)
        }
      }, 21.32)
      this.render_hexagram_modal_text(collection)
    }
  },

  clear_hex_modal : function () {
    document.querySelectorAll('.hex-title').forEach( function (title_el) {
      title_el.innerHTML = ''
    })
    document.querySelectorAll('.read-hex').forEach( function (read_el) {
      read_el.innerHTML = ''
      read_el.href = '#'
    })
    document.querySelectorAll('.inner-hex').forEach( function (inner_el) {
      inner_el.href = '#'
    })
  },

  close_hex_modal : function () {
    hex_assembler.hex_modal.style.display = 'none'
    document.querySelector('#app').style.opacity = 1
    hex_assembler.clear_hex_modal()
    //clear_modal_content();
  },

  toggle_filter_menu : function (self,arg) {
    const props = ['none','block']
    const select = document.querySelector('#filter-menu')
    const next_arg = (arg) ? 0 : 1
    select.style.display = props[arg]
    self.setAttribute('data-toggle',next_arg.toString())
  }
}

hex_assembler.hexagram_menu_tabs.forEach( function (menu_tab) {
  menu_tab.addEventListener('click', function (event) {
    hex_assembler.toggle_tab( this.getAttribute('data-toggle'), this.id )
  })
})

document.querySelector('#hex-filter').addEventListener('click', function (event) {
  var arg = Number(this.getAttribute('data-toggle'))
  hex_assembler.toggle_filter_menu(this,arg)
})

document.querySelector('#close-hex-modal').addEventListener('click',hex_assembler.close_hex_modal)

hex_assembler.filter_menu.addEventListener('change', function (event) {
  hex_assembler.triage_hex_filter(this.value)
})

document.querySelector('#close-filter-modal').addEventListener('click', hex_assembler.close_trigram_filter_modal)

document.querySelector('#filter-submit').addEventListener('click',function (event) {
  var trigram_select = document.querySelector('#select-trigram')
  var hex_side_select = document.querySelector('#select-hex-segment')
  var hex_indices_arr = hex_assembler.filter_by_trigram(trigram_select.value,hex_side_select.value)
  var els_arr = hex_assembler.filter_dom(hex_indices_arr)
  hex_assembler.reset_filtered_dom(els_arr)
  hex_assembler.close_trigram_filter_modal()
})

hex_assembler.init()
