'use strict'

/**
*  Imports library from hex-control
*
*  Exports object: hex_builder
*
*/

const hex_builder = {
  this_hex : [],
  next_hex : [],
  moving_lines : [],

  graph : document.querySelector('#wheel-inner'),
  regraph : document.querySelector('#second-hex'),

  throw_line : function () {
    let val = Math.random()
    if (this.this_hex.length!=6) {
      if (val >= 0 && val < 0.25) {

        this.this_hex.push(0)

      } else if (val >= 0.25 && val < 0.5) {

        this.this_hex.push(1)

      } else if (val >= 0.5 && val < 0.75) {

        this.this_hex.push(0)
        this.moving_lines.push(this.this_hex.length-1)

      } else if (val >= 0.75 && val <= 1 ){

        this.this_hex.push(1)
        this.moving_lines.push(this.this_hex.length-1)

      } else {
        console.log('math randomization error')
      }
    }
    this.next_hex = []
    this.this_hex.forEach(function (this_line) { hex_builder.next_hex.push(this_line) })
    this.moving_lines.forEach( function (moving_line) {
      hex_builder.next_hex[moving_line] = (hex_builder.next_hex[moving_line] === 1) ? 0 : 1
    })
    /*
    console.log(val)
    console.log(this.this_hex)
    console.log(this.next_hex)
    console.log(this.moving_lines)
    */
  },

  print_hex : function () {
    const routines = ['yin_line','yang_line']
    const hex_shells = [hex_builder.graph,hex_builder.regraph]
    const hex_data = [this.this_hex, this.next_hex]

    for (var i = 0; i < hex_data.length; i++) {

      var parent = hex_shells[i]
      parent.innerHTML = ''

      for (var ii = hex_data[i].length-1; ii > -1 ; ii-- ) {

        parent.appendChild( this.line_builder[ routines[ hex_data[i][ii] ] ](true) )

      }
    }
  },

  line_builder : {
    yang_line :  function (arg) {
      const line = document.createElement('div')
      const wrapper = document.createElement('div')
      wrapper.className = "flex-row flex-center line-frame"
      line.className = "full-line"
      if (!arg) {
        line.style.backgroundColor = 'black'
      }
      wrapper.appendChild(line)
      return wrapper
    },
    yin_line : function (arg) {
      const line_1 = document.createElement('div')
      const line_2 = document.createElement('div')
      const wrapper = document.createElement('div')
      const subwrapper = document.createElement('div')
      wrapper.className = "flex-row flex-center line-frame"
      subwrapper.className = "half-line-frame flex-row flex-between"
      line_1.className = "half-line"
      line_2.className = "half-line"
      subwrapper.appendChild(line_1)
      subwrapper.appendChild(line_2)
      wrapper.appendChild(subwrapper)
      return wrapper
    },
    half_line : function (arg) {
      const justify = (arg) ?  'flex-start' : 'flex-end'
      const line = document.createElement('div')
      const wrapper = document.createElement('div')
      const subwrapper = document.createElement('div')
      subwrapper.className = "half-line-frame flex-row"
      wrapper.className = "flex-row flex-center line-frame"
      line.className = "half-line"
      subwrapper.style.justifyContent = justify
      subwrapper.appendChild(line)
      wrapper.appendChild(subwrapper)
      return wrapper
    },
    null_line : function () {
      const line = this.yang_line(false)
      return line
    },
    // print a random line with a random opacity
    manifest_line : function () {
      const funcs = ['yang_line','yin_line','half_line','half_line','yang_line']
      const index = Math.floor(Math.random() * 4)
      let line = {}
      let arg = (Math.floor(Math.random() * 2) > 1) ? true : false;
      let trans = Math.random()
      arg = (!index||index===4) ? true : arg
      line = this[funcs[index]](arg)
      //console.log('line testpattern')
      //console.log(funcs[index])
      //console.log(arg)
      trans = (trans >= 0.9) ? trans-0.1 : trans
      line.style.opacity = trans
      return line
    },
    test_pattern : function () {
      const indices = []
      const re_indices = []

      for (let  i = 0; i < 3; i++) {
        var  int = Math.floor(Math.random()*6)
        indices.push(int)
      }

      if (hex_builder.next_hex.length) {
        for (let  j = 0; j < 3; j++) {
          let  re_int = Math.floor(Math.random()*6)
          re_indices.push(int)
        }
      }
      // console.log('index_ints')
      // console.log(indices)
      hex_builder.graph.innerHTML = ''
      hex_builder.regraph.innerHTML = ''
      //
      // Create a random hexagram for each field:
      // print random lines or empty lines
      // -- based on whether the line index is in an array of random integers
      for (let ii = 0; ii < 6; ii++) {
        const dom_obj = (indices.indexOf(ii)>-1) ?
          this.manifest_line() : this.null_line()
        hex_builder.graph.appendChild(dom_obj)
        if (hex_builder.next_hex.length) {
          const re_dom_obj = (re_indices.indexOf(ii)>-1) ?
            this.manifest_line() : this.null_line()
          hex_builder.regraph.appendChild(re_dom_obj)
        } // end next hex cond
      } // end find three of six loop
    } // end testpattern
  }
}

// Main UI Element - inherits hex_builder object, uses hex-data.library

document.querySelector('#wheel-outer').addEventListener('click', function (event) {

  // encapsulated functions for Main UI

  function get_hex_name(bin_arr) {
    // using hex-data.library
    let index = library.get_hex_index(bin_arr)
    let names = library.select_names(index)
    return names
  }

  function print_hex_headers(this_hex,next_hex,moving_lines) {
    const hexname_els = document.querySelectorAll('.hex-name')
    const hex_arrs = [this_hex, next_hex]
    let name_str = ''
    for (var i = 0; i < hexname_els.length; i++) {
      name_str = (!i || moving_lines) ? get_hex_name(hex_arrs[i]) : ''
      name_str = (name_str) ? name_str.replace(/\s\|\s/g,'<br/>') : ''
      hexname_els[i].innerHTML = (name_str) ? name_str : hexname_els[i].innerHTML
    }
  }

  function print_moving_icon() {
    const icon = document.querySelector('#hex-mover')
    icon.style.display= 'block'
  }

  function flash_greys(n) {
    document.querySelector('#wheel-outer').style.backgroundColor = 'rgb(' + n + ',' + n + ',' + n + ')'
    return n
  }

  if (event.target.id.indexOf('outer-v')>-1) {
    //
    hex_builder.throw_line()
    //
    var n = 129
    var dir = true
    //animate the line-throw event
    var flash = setInterval( function () {
        //
        n = flash_greys(n)
        hex_builder.line_builder.test_pattern()
        //
        if (!dir) {
          if (n > 128) { n-- } else {
            //
            clearInterval(flash)
            //
            hex_builder.print_hex()
            //
            if (hex_builder.this_hex.length===6) {
              //
              print_hex_headers(hex_builder.this_hex,hex_builder.next_hex,hex_builder.moving_lines)
              //
              if (hex_builder.moving_lines.length) {
                //
                print_moving_icon()
              }
            }
          }
        } else {
          n++
          if (n > 211) { dir = false }
        }
        //console.log(n)
      },
      20
    )
    //console.log(event.target.id)
  }
  event.stopPropagation()
})
