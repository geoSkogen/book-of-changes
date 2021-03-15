'use strict'

var wheel = document.querySelector('#wheel-outer')
var graph = document.querySelector('#wheel-inner')
var line_builder = {
  yang_line :  function (arg) {
    var line = document.createElement('div')
    var wrapper = document.createElement('div')
    wrapper.className = "flex-row flex-center line-frame"
    line.className = "full-line"
    if (!arg) {
      line.style.backgroundColor = 'black'
      wrapper.appendChild(line)
    }
    return wrapper
  },
  yin_line : function (arg) {
    var line_1 = document.createElement('div')
    var line_2 = document.createElement('div')
    var wrapper = document.createElement('div')
    var subwrapper = document.createElement('div')
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
    var justify = (arg) ?  'flex-start' : 'flex-end'
    var line = document.createElement('div')
    var wrapper = document.createElement('div')
    var subwrapper = document.createElement('div')
    subwrapper.className = "half-line-frame flex-row"
    wrapper.className = "flex-row flex-center line-frame"
    line.className = "half-line"
    subwrapper.style.justifyContent = justify
    subwrapper.appendChild(line)
    wrapper.appendChild(subwrapper)
    return wrapper
  },
  null_line : function () {
    var line = this.yang_line(false)
    return line
  },
  manifest_line : function () {
    var line = {}
    var funcs = ['yang_line','yin_line','half_line','half_line','yang_line']
    var index = Math.floor(Math.random() * 4)
    var arg = (Math.floor(Math.random() * 2) > 1) ? true : false;
    var trans = Math.random()
    arg = (!index||index===4) ? true : arg
    line = this[funcs[index]](arg)
    console.log('line testpattern')
    console.log(funcs[index])
    console.log(arg)
    trans = (trans >= 0.9) ? trans-0.1 : trans
    line.style.opacity = trans
    return line
  },
  test_pattern : function () {
    var indices = []
    for (var i = 0; i < 3; i++) {
      var int = Math.floor(Math.random()*6)
      indices.push(int)
    }
    console.log('index_ints')
    console.log(indices)
    graph.innerHTML = ''
    for (var ii = 0; ii < 6; ii++) {
      var dom_obj = (indices.indexOf(ii)>-1) ?
        this.manifest_line() : this.null_line()
      graph.appendChild(dom_obj)
    }
  }

}

wheel.addEventListener('click', function (event) {
  if (event.target.id.indexOf('outer')>-1) {
    var n = 129
    var dir = true
    var value = graph.innerHTML
    var flash = setInterval( function () {
        n = flash_greys(n)
        line_builder.test_pattern()
        if (!dir) {
          if (n > 128) { n-- } else {
            clearInterval(flash)
            graph.innerHTML = value
          }
        } else {
          n++
          if (n > 211) { dir = false }
        }
        console.log(n)

      },
      20
    )
    console.log('clique')
    console.log(event.target.id)
  }
  event.stopPropagation()
})

function flash_greys(n) {
  wheel.style.backgroundColor = 'rgb(' + n + ',' + n + ',' + n + ')'
  return n
}
