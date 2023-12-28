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
      console.log("MAIN::main could not locate class definitions for Book, Builder, View, and Modal.")
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
    * Line toggle-button handler
    * @param string toggle_button_id
    * @return array - of Hexagram objects
    */
    function _init_line_toggle(toggle_button_id) {

      let result = null
      let line_fields = VIEW.getLineFieldsById(toggle_button_id)
      if (line_fields) {
        BUILDER.toggleLine(line_fields.lineIndex,line_fields.hexIndex)
        VIEW.toggleLine(line_fields.lineIndex,line_fields.hexIndex)

        result = BOOK.getHexagramsByLinesConfig(
          BUILDER.getLinesConfig()
        )
      } else {
        console.log('Main::main _init_line_toggle > View::getLineFieldsById did not locate line data for ' + toggle_button_id)
      }

      return result
    }

    /**
    * Render the current data state of the hexagrams set in the UI
    * @param array - of Hexagrams
    * @return void
    */
    function _init_show_titles(hexagrams) {

      if (!Array.isArray(hexagrams)) {
        console.log('Main::main _init_show_titles expects an array of Hexagram objects as an argument.')
        return
      }

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
    }

    /**
    * Tranform URL query string into an associative array
    * @param string
    * @return object - associative array
    */
    function _init_get(query_str) {
      const get = {}
      query_str.replace('?','').split('&').forEach( (key_val_str) => {
        let key_val_arr = key_val_str.split('=')
        get[key_val_arr[0]] = key_val_arr[1]
      })
      return get
    }

    /**
    * Construct a Hexagram configuration from a URL query in this format: ?id=12&moving_lines=345
    * @param object get - associative array
    * @return void
    */
    function _init_hex_from_uri(get) {

      if (typeof get!= 'object') {
        console.log('Main::main _init_hex_from_uri expects an associative array (object) as an argument.')
        return
      }

      let lines_config_arr = []
      let line_config_str = ''
      let hexagrams = []
      let result = null

      if (get['id']) {
        line_config_str = BOOK.getLineConfigByHexagramNumber(Number(get['id']))
        lines_config_arr.push(line_config_str)

        if (get['moving_lines']) {
          lines_config_arr.push(
            BUILDER.getNewLineConfigByMovingLines(
              line_config_str,
              get['moving_lines'].split('')
            )
          )
        } else {
          lines_config_arr.push(line_config_str)
        }

        hexagrams = BOOK.getHexagramsByLinesConfig(lines_config_arr)

        if (hexagrams.length) {
          result = VIEW.renderHexagrams(hexagrams)

          _init_show_titles(hexagrams)
        } else {
          console.log('Main::main _init_hex_from_uri could not create hexagrams from the passed arguments.')
        }
      } else {
        console.log('Main::main _init_hex_from_uri was passed unrecognized GET parameters.')
      }
      return result
    }

    // PROCEDURE:
    /**
    * Initial Screen - set the default line configuration and pass it to the view
    */
    let view
    if (window.location.search) {
      view = _init_hex_from_uri(_init_get(window.location.search))
    }

    if (!view) {
      let hexagrams = BOOK.getHexagramsByLinesConfig(['101010','010101'])

      VIEW.renderHexagrams(hexagrams)

      _init_show_titles(hexagrams)
    }



    // USER INTERFACE EVENT LISTENERS:
    for (let i = 0; i < VIEW.lineButtons.length; i++) {
      let line_button = VIEW.lineButtons[i]
      line_button.addEventListener('click', function (event) {
        let hexagrams = _init_line_toggle(line_button.id)
        if (hexagrams) {
          _init_show_titles(hexagrams)
        }
      })
      /**
      * DOM activates the buttonw' click event on Enter key event
      */
      /*
      line_button.addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
          event.preventDefault()
          let hexagrams = _init_line_toggle(line_button.id)
          if (hexagrams) {
            _init_show_titles(hexagrams)
          }
        }
      })
      */
    }

    VIEW.firstHexNameButton.addEventListener('click',function (event) {
      if (BUILDER.hexagrams[0]) {
        MODAL.showHexagram( BUILDER.hexagrams[0], VIEW.firstHexNameButton.id)
      } else {
        console.log('firstHexName event listener did not find a hexagram 1.')
      }
    })

    VIEW.firstHexNameButton.addEventListener('keypress', function (event) {
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

    VIEW.secondHexNameButton.addEventListener('keypress', function (event) {
      if (event.code==='Enter') {
        if (BUILDER.hexagrams[1]) {
          MODAL.showHexagram( BUILDER.hexagrams[1], VIEW.secondHexNameButton.id)
        } else {
          console.log('secondHexName event listener did not find a hexagram 2.')
        }
      }
    })

    } else {
      console.log("MAIN::main did not yet get valid responses to its request for library and typeface data.")
    }

  },

  responses : {},

  data_paths : {
    library : "../data/book/hex-data.json",
    typeface : "../data/book/hex-chars.json"
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
