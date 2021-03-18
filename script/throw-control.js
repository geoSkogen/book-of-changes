'use strict'

var hex_names = document.querySelectorAll('.hex-name')
var hex_modal = document.querySelector('#hex-modal')
var hex_modal_closer = document.querySelector('#close-hex-modal')
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

var modal_dom_scheme = {
  articles : {
    classes:['title','title','title','title','flex-row flex-around'],
    ids:['number','name-title','name-alt','name-mod','meta-cols'],
    articles : {
      classes : ['flex-col flex-center'],
      ids : ['meta-col-inner'],
      articles: {
        classes : ['purport','purport'],
        ids : ['hex-meta','moving-lines'],
        articles: null,
      }
    }
  }
}

hex_names.forEach( function (hex_name_el) {

  hex_name_el.addEventListener('click', function (event) {
    var collection = {
      number: -1,
      names: '',
      articles: {
        inner: {
          desc:'', lines:[]
        },
        outer: {
          desc:'', lines:[]
        }
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
    console.log(current_hex)
    console.log(event.target.id)
    collection.number
     = library.get_hex_index(current_hex)
    collection.names = library.select_names(collection.number)
    descs = library.select_text(collection.number)
    collection.articles.inner.desc = descs.inner
    collection.articles.outer.desc = descs.outer
    collection.articles.inner.lines =
      library.select_moving_lines(collection.number,hex_builder.moving_lines,1)
    collection.articles.outer.lines =
      library.select_moving_lines(collection.number,hex_builder.moving_lines,0)
    render_modal_text(collection)
    open_hex_modal()
  })//ends event listener function

})//ends hex iteration

hex_modal_closer.addEventListener('click',close_hex_modal)

function open_hex_modal() {
  hex_modal.style.display = 'flex'
  app_shell.style.opacity = 0.33
}

function close_hex_modal() {
  hex_modal.style.display = 'none'
  app_shell.style.opacity = 1
  hex_modal.innerHTML = ''

}

function render_modal_text(collection) {

  var names = collection.names.split(' | ')
  for (var i = 0; i < names.length+1; i++) {
    modal_dom['h'+i].innerHTML = (i) ? names[i-1] : collection.number
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
          if (collection.articles[side_key][text].length) {
            collection.articles[side_key][text].forEach( function (line_text) {
              var line_text = document.createTextNode(line_text)
              var line_el = document.createElement('li')
              line_el.appendChild(line_text)
              list.appendChild(line_el)
            })
            modal_dom.articles[side_key][text].appendChild(list)
          }
          break
        default :
          console.log('irregular data collection object')
      }
    })
  })

}
