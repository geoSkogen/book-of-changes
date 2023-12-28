(function () {

const MAIN = {

  main : function() {

    if (
      typeof Book != 'function' &&
      typeof Builder != 'function' &&
      typeof View != 'function' &&
      typeof Modal != 'function'
    )
    {
      console.log("MAIN::main could not locate class definitions for Book, Builder, and View.")
      return
    }

    let library = this.responses.library ? JSON.parse(this.responses.library) : null
    let typeface = this.responses.typeface ? JSON.parse(this.responses.typeface) : null

    if (library && typeface)
    {
    // CONSTANTS:
    const BOOK = new Book(library,typeface)
    const BUILDER = new Builder()
    const VIEW = new View()
    const MODAL = new Modal()


    // FUNCTIONS:
    /**
    *  Primary user-input event handler using constants in Main::main namespace
    */
    function _init_line() {

      let line_data = BUILDER.addLine()

      if (!line_data || !line_data[0]) {
        console.log('Main::main _init_line no line data returned by Builder')
        return
      }

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
    }

    /**
    * Create a full hexagram on the DOM without any user input
    * @param array lines_config_arr
    * @return void
    */
    function _init_hex(lines_config_arr) {
      if (!Array.isArray(lines_config_arr)) {
        console.log('Main::main _init_hex expects an array as an argument.')
        return
      }

      let hexagrams = BOOK.getHexagramsByLinesConfig(lines_config_arr)
      if (hexagrams.length) {
        for (let i = 0; i < hexagrams.length; i++)  {
          if (hexagrams[i]) {
            BUILDER.setHexagram(hexagrams[i],i)
            VIEW.addLines(lines_config_arr[i],i)
          }
        }

        VIEW.showHexagramNames(hexagrams)
      } else {
        console.log('Main::main _init_hex could not create hexagrams from the passed arguments.')
      }
    }


    // URL QUERY HANDLER:
    if (window.location.search) {
      const REQUEST = new Request(window.location)
      let lines_config_arr = REQUEST.getHexagramsLinesConfig(library.hex_bin_arr)
      _init_hex(lines_config_arr)
    }


    // UER INTERFACE EVENT LISTENERS:
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
