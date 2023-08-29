(function () {

const MAIN = {

  main : function() {

    if (
      typeof Book === 'function' &&
      typeof Builder === 'function' &&
      typeof View === 'function' &&
      typeof Modal === 'function'
    )
    {
      let library = this.responses.library ? JSON.parse(this.responses.library) : null
      let typeface = this.responses.typeface ? JSON.parse(this.responses.typeface) : null

      if (library && typeface) {
        // CONSTANTS
        const BOOK = new Book(
          library.hex_bin_arr,
          library.tri_bin_arr,
          library.hex_name_arr,
          library.tri_names_arr,
          library.purports_inner,
          library.purports_outer,
          library.moving_lines_inner,
          library.moving_lines_outer,
          typeface.hex_lines_chars_arr,
          typeface.hex_chars_table,
          typeface.tri_lines_chars_arr,
          typeface.tri_chars_arr,
          library.inner_indices,
          library.sovereign_indices
        )

        const BUILDER = new Builder()
        const VIEW = new View()
        const MODAL = new Modal()

        function _init_line_toggle(toggle_button_id) {
          let result = null
          if (typeof toggle_button_id === 'string') {
            let hexagrams = []
            let line_indices = toggle_button_id.split('-')
            let line_index = line_indices[2] ? Number(line_indices[1]) : null
            let hex_index = line_indices[3] ? Number(line_indices[2]) : null

            if (line_index && hex_index) {
              BUIDLER.toggleLine(line_index-1,hex_index-1)

              hexagrams = BOOK.getHexagramsByLinesConfig(
                BUILDER.getLinesConfig()
              )
              result = hexagrams
            } else {
              console.log('Main::main _init_line_toggle was passed an unrecognized ID string: ' + toggle_button_id )
            }
          } else {
            console.log('Main::main _init_line_toggle expects a string as an argument.')
          }
          console.log(hexagrams)
          return result
        }

        function _init_show_titles(hexagrams) {
          if (Array.isArray(hexagrams)) {
            if (hexagrams[0]) {
              BUILDER.setHexagram(hexagrams[0],0)
              VIEW.showHexagramName(hexagrams[0],0)
              if (hexagrams[1]) {
                BUILDER.setHexagram(hexagrams[1],1)
                VIEW.showHexagramName(hexagrams[1],1)
              }
            }
          } else {
            console.log('Main::main _show_titles expects an array of Hexagram objects as an argument.')
          }
        }

        // Initial Test Pattern
        _init_show_titles(
          BOOK.getHexagramsByLinesConfig(
            ['101010','010101']
          )
        )

        // EVENT LISTENERS
        for (let i = 0; i < VIEW.lineButtons.length; i++) {

          let line_button = VIEW.lineButtons[i]

          line_button.addEventListener('click', function (event) {

          })
          line_button.addEventListener('keyup', function (event) {
            if (event.code === 'Enter') {

            }
          })
        }

      } else {
        console.log("MAIN::main did not yet get valid responses to its request for library and typeface data.")
      }
    } else {
      console.log("MAIN::main could not locate class definitions for Book, Builder, and View.")
    }
  },

  responses : {},

  data_paths : {
    library : "lib/book/hex-data.json",
    typeface : "lib/book/hex-chars.json"
  },

  request : function() {
    const self = this
    Object.keys(self.data_paths).forEach( (data_path_key) => {

      let xhttp = new XMLHttpRequest();
      xhttp.open("GET", self.data_paths[data_path_key], true)

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          self.responses[data_path_key] = this.responseText
          self.init()
        }
      }
      xhttp.send()
    })
  },

  init : function() {
    for (let i = 0; i < Object.keys(this.data_paths).length; i++) {
      let data_path_name = Object.keys(this.data_paths)[i]

      if (this.responses[data_path_name] && JSON.parse(this.responses[data_path_name]) ) {
        console.log("MAIN::main received a valid JSON response for endpoint: " + data_path_name)
        continue
      } else {
        console.log("MAIN::main could not locate a valid JSON response for endpoint: " + data_path_name)
        break
        return null
      }
    }
    return this.main(this.responses)
  }
}

MAIN.request()

})()
