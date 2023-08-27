'use strict'

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
        // _init_line() event handler using constants in namespace
        function _init_line() {
          let line_data = BUILDER.addLine()
          if (line_data) {
            VIEW.addLine(line_data.lineVals[0],0)
            if (line_data.lineVals[1]) {
              if (line_data.firstMovingLine) {
                line_data.firstHexPreviousLines.forEach( (line_val) => {
                  VIEW.addLine(line_val.toString(),1)
                })
              }
              VIEW.addLine(line_data.lineVals[1],1)
            }

            if (BUILDER.isComplete) {
              let hexagrams = BOOK.getHexagramsByLinesConfig(
                BUILDER.getLinesConfig(),
                BUILDER.movingLines
              )
              if (hexagrams[0]) {
                BUILDER.setHexagram(hexagrams[0],0)
                if (hexagrams[1]) {
                  BUILDER.setHexagram(hexagrams[1],1)
                }
                VIEW.showHexagramNames(hexagrams)
              }
              console.log(hexagrams)
            }
          } else {
            console.log('Main::main _init_line no line data returned by Builder')
          }
        }


        // EVENT LISTENERS
        VIEW.lineButton.addEventListener('click', function (event) {
          _init_line()
        })

        VIEW.lineButton.addEventListener('keyup', function (event) {
          if (event.code==='Enter') {
            _init_line()
          }
        })

        VIEW.firstHexNameButton.addEventListener('click',function (event) {
          if (BUILDER.hexagrams[0]) {
            MODAL.showHexagram( BUILDER.hexagrams[0], event.target)
          } else {
            console.log('firstHexName event listener did not find a hexagram 1.')
          }

        })

        VIEW.firstHexNameButton.addEventListener('keyup', function (event) {
          if (event.code==='Enter') {
            if (BUILDER.hexagrams[0]) {
              MODAL.showHexagram( BUILDER.hexagrams[0], event.targe)
            } else {
              console.log('firstHexName event listener did not find a hexagram 1.')
            }
          }
        })

        VIEW.secondHexNameButton.addEventListener('click',function (event) {
          if (BUILDER.hexagrams[1]) {
            MODAL.showHexagram( BUILDER.hexagrams[1], event.target)
          } else {
            console.log('secondHexName event listener did not find a hexagram 2.')
          }
        })

        VIEW.secondHexNameButton.addEventListener('keyup', function (event) {
          if (event.code==='Enter') {
            if (BUILDER.hexagrams[1]) {
              MODAL.showHexagram( BUILDER.hexagrams[1], event.target)
            } else {
              console.log('secondHexName event listener did not find a hexagram 2.')
            }
          }
        })

        MODAL.closeModalElement.addEventListener('click', function (event) {
          MODAL.hide(event.target)
        })

        MODAL.closeModalElement.addEventListener('keyup', function (event) {
          if (event.code==='Enter') {
            MODAL.hide(event.target)
          }
        })

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