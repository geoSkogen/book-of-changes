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
        // _init_line() event handler using constants in namespace
        function _init_line() {
          let line_data = BUILDER.addLine()
          if (line_data && line_data[0]) {

            VIEW.flashPattern()

            VIEW.addLine(line_data[0].lineVal,line_data[0].hexIndex,line_data[0].lineIndex)

            if (line_data[1]) {
              if (line_data.firstMovingLine) {
                for (let i = 0; i < line_data.firstHexPreviousLines.length; i++) {
                  let line_val = line_data.firstHexPreviousLines[i]
                  VIEW.addLine(line_val.toString(),1,i)
                }
              }
              VIEW.addLine(line_data[1].lineVal,line_data[1].hexIndex,line_data[1].lineIndex)
            }

            if (BUILDER.isComplete) {
              let hexagrams = BOOK.getHexagramsByLinesConfig(
                BUILDER.getLinesConfig()
              )
              if (hexagrams[0]) {
                BUILDER.setHexagram(hexagrams[0],0)
                if (hexagrams[1]) {
                  BUILDER.setHexagram(hexagrams[1],1)
                }
                VIEW.showHexagramNames(hexagrams)
              }
            }
          } else {
            console.log('Main::main _init_line no line data returned by Builder')
          }
        }

        function _init_add_hex_lines(line_config_str,hex_index) {
          for (let i = 0; i < line_config_str.length; i++) {
            VIEW.addLine(line_config_str[i],hex_index,i)
          }
        }

        // Construct a Hexagram configuration from a URL query in this format #/13/#/345
        function _init_hex_from_uri(uri) {
          if (uri.indexOf('#')) {

            let lines_config_arr = []
            let line_config_str = ''
            let hexagrams = []

            let uri_arr = uri.replace(/\//g,'').split('#')
            uri_arr.shift()

            if (uri_arr[0]) {
              line_config_str = BOOK.getLineConfigByHexagramNumber(Number(uri_arr[0]))
              lines_config_arr.push(line_config_str)

              if (uri_arr[1]) {
                lines_config_arr.push(
                  BUILDER.getNewLineConfigByMovingLines(
                    line_config_str,
                    uri_arr[1].split('')
                  )
                )
              }

              let hexagrams = BOOK.getHexagramsByLinesConfig(lines_config_arr)
              if (hexagrams.length) {
                for (let i = 0; i < hexagrams.length; i++)  {

                  BUILDER.setHexagram(hexagrams[i],i)

                  if (lines_config_arr[i]) {
                    _init_add_hex_lines(lines_config_arr[i],i)
                  }
                }

                VIEW.showHexagramNames(hexagrams)

              } else {
                console.log('Main::main _init_hex_from_uri could not create hexagrams from the passed arguments.')
              }
            }
          } else {
            console.log('Main::main _init_hex_from_uri was passed an invalid uri string.')
          }
        }

        // URL query
        window.addEventListener('load', function (event) {
          if (/\#\/\d+\/\#\/\d+/.test(window.location.href)) {
            _init_hex_from_uri(window.location.href)
          }
        })

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
            MODAL.showHexagram( BUILDER.hexagrams[0], VIEW.firstHexNameButton.id)
          } else {
            console.log('firstHexName event listener did not find a hexagram 1.')
          }
        })

        VIEW.firstHexNameButton.addEventListener('keyup', function (event) {
          if (event.code==='Enter') {
            if (BUILDER.hexagrams[0]) {
              MODAL.showHexagram( BUILDER.hexagrams[0], VIEW.firstHexNameButton.id)
            } else {
              console.log('firstHexName event listener did not find a hexagram 1.')
            }
          }
        })

        VIEW.secondHexNameButton.addEventListener('click',function (event) {
          if (BUILDER.hexagrams[1]) {
            MODAL.showHexagram( BUILDER.hexagrams[1], VIEW.secondHexNameButton.id)
          } else {
            console.log('secondHexName event listener did not find a hexagram 2.')
          }
        })

        VIEW.secondHexNameButton.addEventListener('keyup', function (event) {
          if (event.code==='Enter') {
            if (BUILDER.hexagrams[1]) {
              MODAL.showHexagram( BUILDER.hexagrams[1], VIEW.secondHexNameButton.id)
            } else {
              console.log('secondHexName event listener did not find a hexagram 2.')
            }
          }
        })

        VIEW.refreshButton.addEventListener('click', function (event) {
          VIEW.reset()
          BUILDER.reset()
        })

        VIEW.refreshButton.addEventListener('keyup', function (event) {
          if (event.code==='Enter') {
            VIEW.reset()
            BUILDER.reset()
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
    library : "data/book/hex-data.json",
    typeface : "data/book/hex-chars.json"
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
