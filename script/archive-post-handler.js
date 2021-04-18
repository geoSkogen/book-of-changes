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

var folder_icon = document.querySelector('#hex-archive')
folder_icon.addEventListener('click', function (event) {
  var result = {}
  var collection = {
    // test data
    'addressee' : 'tom',
    'author': 'self',
    'body': 'test post',
    'hex_index': '65',
    'mvng_lines' : '1,2,3,4,5',
    'post_type' : 'txtmsg',
    'api_user' : 'archive_bot_1',
    'api_key' : 'etakeH#333'
  }
  result = post_archive(collection)
  //console.log(result)
})
