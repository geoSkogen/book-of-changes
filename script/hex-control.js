'use strict'

var library = {
  get_hex_index : function (the_hex_arr) {
    var bin_str = the_hex_arr.join('')
    return (hex_bin_arr.indexOf(bin_str) > 0 ) ?
      hex_bin_arr.indexOf(bin_str) : false
  },
  select_names : function (the_hex_index) {
    var result = (the_hex_index && hex_name_arr[the_hex_index]) ?
      hex_name_arr[the_hex_index] : false
    return result
  },
  select_text : function (the_hex_index) {
    var result = (the_hex_index > 0 && purports_outer[the_hex_index] ) ?
      {
        inner: purports_inner[the_hex_index],
        outer: purports_outer[the_hex_index]
      } : false
    return result
  },
  select_moving_lines : function (hex_index,lines_arr,side_arg) {
    var text_arr = []
    var current_table = (side_arg) ? moving_lines_inner : moving_lines_outer;
    var lines_arr = (!lines_arr.length) ? [-1] : lines_arr
    if (hex_index && current_table[hex_index]) {
      lines_arr.forEach( function (line) {
        if (current_table[hex_index][line+1]) {
          text_arr.push(current_table[hex_index][line+1])
        }
      })
    }
    return text_arr
  }
}
