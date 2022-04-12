'use strict'

/**
*  Exports archive_control object 
*/

const archive_control = {
  message_wrappers : document.querySelectorAll('.message-wrapper'),

  get_message_collection : function (index) {
    var data_el = document.querySelector('#archive-api')
    var archives = JSON.parse(data_el.innerHTML)
    var this_row = ( archives[index] ) ? archives[index] : [];
    console.log(this_row)
    return this_row
  },

  render_modal_content : function (collection) {
    var message_modal = document.querySelector('#message-modal')
    var header_els = message_modal.querySelectorAll('.header-fraggle')
    var ids = ['body','moving_lines']
    header_els.forEach( function (el) {
      var header_text = ( collection[el.id]) ? collection[el.id] : ''
      if (el.id==='date_time') {
        var date_arr = collection[el.id].split(' ')[0].split('-')
        var time_arr  = collection[el.id].split(' ')[1].split(':')
        header_text = date_arr[1] + '-' + date_arr[2] + " " + time_arr[0] +
          ':'+  time_arr[1]
      }
      if (el.id==='hex_index') {
        header_text = hex_lines_chars_arr[ Number(collection[el.id]) ] + ' ' +
           hex_chars_table[ Number(collection[el.id]) ][0]
      }
      el.innerHTML = header_text
    })
    ids.forEach( function (id_str) {
      console.log(id_str)
      message_modal.querySelector('#' + id_str).innerHTML = (collection[id_str]) ?
        collection[id_str] : ''
    })
    message_modal.style.display = 'block';
    document.querySelector('#app').style.opacity = '0.33'
  }
}

for (var i = 0; i < archive_control.message_wrappers.length; i++) {
  archive_control.message_wrappers[i].addEventListener('click', function (event) {
    var row_index = this.id.replace('message-','')
    var collection = archive_control.get_message_collection(row_index)
    archive_control.render_modal_content(collection)
  })
}

document.querySelector('.close-message-modal').addEventListener('click', function (event) {
  document.querySelector('#message-modal').style.display = 'none';
  document.querySelector('#app').style.opacity = '1'
})
