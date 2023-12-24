(function () {

const MAIN = {

  main : function() {

    if (
      typeof Book != 'function' &&
      typeof Builder != 'function' &&
      typeof View != 'function' &&
      typeof Modal != 'function' &&
      typeof FilterMenu != 'function'
    )
    {
      console.log("MAIN::main could not locate class definitions for Book, Builder, View, Modal, and FilterMenu")
      return
    }
    let library = this.responses.library ? JSON.parse(this.responses.library) : null
    let typeface = this.responses.typeface ? JSON.parse(this.responses.typeface) : null

    if (library && typeface)
    {
    // CONSTANTS
    const BOOK = new Book(library,typeface)
    const BUILDER = new Builder()
    const VIEW = new View()
    const MODAL = new Modal()
    const FILTERMENU = new FilterMenu()
    const HEXAGRAMS = BOOK.getHexagramsAll()

    // FUNCTIONS:
    /**
    * Return the hexagram array index of its associated DOM Element
    * @param DOMElement - hex_element
    * @return integer
    */
    function _get_hex_element_index(hex_element) {
      if (typeof hex_element != 'object') {
        console.log('MAIN::main _get_hex_element_index expects a DOM element as an argument.')
        return NaN
      }
      if (typeof hex_element.id != 'string') {
        console.log('MAIN::main _get_hex_element_index was passed a DOM element without an ID attibute.')
        return NaN
      }

      let hex_index_arg = hex_element.id.replace('hexagram-menu-link-','')

      if (!isNaN(hex_index_arg)) {
        return Number(hex_index_arg)-1
      } else {
        console.log('MAIN::main _get_hex_element_index was passed a DOM element with an unrecognized ID format.')
        return NaN
      }
    }

    /**
    * @param DOMElement hex_element
    * @return void
    */
    function _init_select(hex_element) {
      let hexagram = HEXAGRAMS[_get_hex_element_index(hex_element)]
      let toggle_resp = VIEW.selectHexagram(hexagram.number,0)
      MODAL.show([hexagram],hex_element)
    }

    /**
    * The primary procedure function; populates a tabbed display of selectable tiles
    * @param array hexagrams - an array of Hexagram objects
    */
    function _init_render(hexagrams) {

      if (!Array.isArray(hexagrams)) {
        console.log('MAIN::main _init_render expects an array as an argument.')
        return 0
      }

      let result = 0

      VIEW.renderHexagrams(hexagrams)
      VIEW.showPanel(VIEW.panels[0].id)

      for (let i = 0; i < VIEW.hexagrams.length; i++) {
        let hex_element = VIEW.hexagrams[i]

        hex_element.addEventListener('click', function (event) {
          _init_select(hex_element)
        })
      }

      result = VIEW.hexagrams.length

      return result
    }


    /**
    * @param integer filter_arg - the index number of the filter operation
    * @return array - an array of Hexagram objects; the results of the filter
    */
    function _init_filter(filter_arg) {
      let result = null
      if (typeof filter_arg != 'number') {
        console.log('MAIN::main _init_filter expects an integer as an arugment.')
        return null
      }
      switch(filter_arg) {
        case 0 :
          result = BOOK.getHexagramsAll()
          FILTERMENU.hideModal()
          break
        case 1 :
          result = BOOK.getSovereignHexagrams()
          FILTERMENU.hideModal()
          break
        case 2 :
          result = BOOK.getInnerHexagrams()
          FILTERMENU.hideModal()
          break
        case 3 :
          result = BOOK.getInnermostHexagrams()
          FILTERMENU.hideModal()
          break
        case 4 :
          FILTERMENU.showModal()
          break
        default :
        console.log('MAIN::main _init_filter was passed an unrecognized filter index.')
      }
      return result
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
    * Construct a pre-filtered collection of hexagrms from a URL query in these formats --
    *   filtered by Trigram: ?segment=lower&id=101
    *   filtered by collecion: ?subset=inner
    * @param object get - associative array
    * @return void
    */
    function _init_filter_from_uri(get) {

      if (typeof get != 'object') {
        console.log('Main::main _init_filter_from_uri expects an associative array (object) as an argument')
        return null
      }

      const hex_segment_names = ['lower','upper']
      let trigram_id = null
      let result = 0

      if (get['segment'] && get['id']) {
        if (hex_segment_names.indexOf(get['segment'])>-1) {

          trigram_id = /^[10]{3}$/.test(get['id']) ? get['id'] : Number(get['id'])

          result =_init_render(
            BOOK.getHexagramsByTrigram(
              trigram_id,
              hex_segment_names.indexOf(get['segment'])
            )
          )

        } else {
          console.log('Main::main _init_filter_from_uri was passed an unrecognized segment query value')
        }
      } else if (get['subset']) {

        switch(get['subset']) {
          case 'all' :
            result = _init_render( BOOK.getHexagramsAll() )
            break
          case 'sovereign' :
            result = _init_render( BOOK.getSovereignHexagrams() )
            break
          case 'inner' :
            result = _init_render( BOOK.getInnerHexagrams() )
            break
          case 'innermost' :
            result = _init_render( BOOK.getInnermostHexagrams() )
            break
          default :
        }

      } else {
        console.log('Main::main _init_filter_from_uri was passed unrecognized query parameters.')
      }
      return result
    }

    // PROCEDURE:
    let view
    if (window.location.search) {
      // Populate the UI accoridng to the URL query, or . . .
      view = _init_filter_from_uri(_init_get(window.location.search))
    } else {
      view = null
    }
    if (!view) {
       // Populate the UI from a pre-set filter; in the case, filtered for "all"
      _init_render(_init_filter(0))
    }

    // USER INTERFACE EVENT LISTENERS:
    FILTERMENU.filterMenu.addEventListener('input', function (event) {
      _init_render(_init_filter( Number(event.target.value)))
    })

    FILTERMENU.filterSubmit.addEventListener('click', function (event) {
      _init_render(
        BOOK.getHexagramsByTrigram(
          Number(FILTERMENU.selectTrigram.value),
          Number(FILTERMENU.selectHexSegment.value)
        )
      )
      FILTERMENU.hideModal()
    })

    FILTERMENU.filterSubmit.addEventListener('keyup', function (event) {
      if (event.code === 'Enter') {
        _init_render(
          BOOK.getHexagramsByTrigram(
            Number(FILTERMENU.selectTrigram.value),
            Number(FILTERMENU.selectHexSegment.value)
          )
        )
        FILTERMENU.hideModal()
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
      xhttp.open("get", self.data_paths[data_path_key], true)

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
