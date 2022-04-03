'use strict'


function post_archive(collection) {
    var valid_fields = 0
    var xhttp = {}
    var resp = null

    Object.keys(collection).forEach( function (key) {

      if (collection[key]!=null) {
        valid_fields++
      }
    })

    if (valid_fields===Object.keys(collection).length) {
      xhttp = new XMLHttpRequest();

      xhttp.open("POST", "endpoints/archives/hexagram/index.php", true)
      xhttp.setRequestHeader("Content-Type", "application/json");

      xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

          //document.getElementById("post-tooltip").innerHTML = this.responseText
          resp = this.responseText
          console.log(resp)
        }
      }

      xhttp.send( JSON.stringify(collection) )
      //console.log( JSON.stringify(collection) )
    } else {
      resp = "to validate a null tuple, assign it an empty string for a value"
      //console.log(resp)
    }
  return resp
}

function sort_archive_fields() {
  var post_body = ( document.querySelector('#messenger-body') ) ?
    document.querySelector('#messenger-body').value : ''
  var collection = {
    // test data
    'addressee' : 'self',
    'author': 'self',
    'body': post_body,
    'hex_index': library.get_hex_index(hex_builder.this_hex),
    'mvng_lines' : hex_builder.moving_lines.join(','),
    'post_type' : 'hexagram',
    'api_user' : 'archive_bot_1',
    'api_key' : 'etakeH#333'
  }
  return collection
}

function render_messenger_header() {
  var index = library.get_hex_index(hex_builder.this_hex)
  if (index) {
    document.querySelector('#hex-char').innerHTML = hex_lines_chars_arr[index]
    document.querySelector('#name-char').innerHTML = hex_chars_table[index][0]
  }
}

function open_messenger_modal() {
  render_messenger_header()
  document.querySelector('#post-tooltip').style.display = 'block'
  document.querySelector('#wheel-frame').style.opacity = '0.33'
  document.querySelector('#second-hex').style.opacity = '0.33'
}

function close_messenger_modal() {
  document.querySelector('#post-tooltip').style.display = 'none'
  document.querySelector('#wheel-frame').style.opacity = '1'
  document.querySelector('#second-hex').style.opacity = '1'
}

var folder_icon = document.querySelector('#hex-archive')
var msg_modal_closer = document.querySelector('#close-msg-modal')
var msg_submitter = document.querySelector('#post-msg')

msg_modal_closer.addEventListener('click', close_messenger_modal)

folder_icon.addEventListener('click', open_messenger_modal)

msg_submitter.addEventListener('click', function () {
  var collection = sort_archive_fields()
  var result = post_archive(collection)
  close_messenger_modal()
  console.log(result)
})
