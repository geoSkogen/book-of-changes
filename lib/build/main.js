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

        // FUNCTIONS
        // Line toggle button handler
        function _init_line_toggle(toggle_button_id) {
          let result = null
          if (typeof toggle_button_id === 'string') {

            let line_fields = VIEW.getLineFieldsById(toggle_button_id)
            if (line_fields) {
              BUILDER.toggleLine(line_fields.lineIndex,line_fields.hexIndex)
              VIEW.toggleLine(line_fields.lineIndex,line_fields.hexIndex)

              result = BOOK.getHexagramsByLinesConfig(
                BUILDER.getLinesConfig()
              )
            } else {
              console.log('Main::main > _init_line_toggle > View::getLineFieldsById did not locate line data for ' + toggle_button_id)
            }
          } else {
            console.log('Main::main > _init_line_toggle expects a string as an argument.')
          }
          console.log(result)
          return result
        }

        function _init_show_titles(hexagrams) {
          if (Array.isArray(hexagrams)) {
            for (let i = 0; i < hexagrams.length; i++) {
              if (hexagrams[i]) {
                BUILDER.setHexagram(hexagrams[i],i)
                VIEW.showHexagramName(hexagrams[i],i)
                VIEW.showTrigramName(hexagrams[i].trigrams[0],0,i)
                VIEW.showTrigramName(hexagrams[i].trigrams[1],1,i)
              } else {
                console.log('Main::main _show_titles found no index ' + i.toString + ' in hexagram array.')
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
            let hexagrams = _init_line_toggle(line_button.id)
            if (hexagrams) {
              _init_show_titles(hexagrams)
            }
          })

          line_button.addEventListener('keyup', function (event) {
            if (event.code === 'Enter') {
              let hexagrams = _init_line_toggle(line_button.id)
              if (hexagrams) {
                _init_show_titles(hexagrams)
              }
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
