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
    * @param string - hex_element_id
    * @return integer
    */
    function _get_hex_id_index(hex_element_id) {

      if (typeof hex_element_id != 'string') {
        console.log('MAIN::main _get_hex_element_index expects a string as an argument.')
        return NaN
      }

      let hex_index_arg = hex_element_id.replace('hexagram-menu-link-','')

      if (!isNaN(hex_index_arg)) {
        return Number(hex_index_arg)-1
      } else {
        console.log('MAIN::main _get_hex_element_index was passed a DOM element with an unrecognized ID format.')
        return NaN
      }
    }

    /**
    * @param string hex_element_id
    * @return void
    */
    function _init_select(hex_element_id) {
      let hexagram = HEXAGRAMS[_get_hex_id_index(hex_element_id)]
      if (hexagram) {
        VIEW.selectHexagram(hexagram.number,0)
        MODAL.show([hexagram],hex_element_id)
      }
    }

    /**
    * The primary procedure function; populates a tabbed display of selectable tiles
    * @param array hexagrams - an array of Hexagram objects
    * @return integer
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
          _init_select(hex_element.id)
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
      let filter_status = ''
      if (typeof filter_arg != 'number') {
        console.log('MAIN::main _init_filter expects an integer as an arugment.')
        return null
      }
      switch(filter_arg) {
        case 0 :
          result = BOOK.getHexagramsAll()
          break
        case 1 :
          result = BOOK.getSovereignHexagrams()
          filter_status = 'sovereign'
          break
        case 2 :
          result = BOOK.getInnerHexagrams()
          filter_status = 'inner'
          break
        case 3 :
          result = BOOK.getInnermostHexagrams()
          filter_status = 'innermost'
          break
        case 4 :
          FILTERMENU.showModal()
          break
        default :
        console.log('MAIN::main _init_filter was passed an unrecognized filter index.')
      }
      if (result && Array.isArray(result) && result.length) {
        VIEW.clearStatus()
        FILTERMENU.hideModal()
        if (filter_status) {
          VIEW.showFilterStatus(filter_status)
        }
      }
      return result
    }

    /**
    * Construct a pre-filtered collection of hexagrms from a URL query in these formats --
    *   filtered by Trigram: ?segment=lower&id=101
    *   filtered by collecion: ?subset=inner
    * @param object filter_obj - associative array, processed URL query variables
    * @return integer
    */
    function _init_filter_from_query(filter_obj) {
      let result = null
      let filter_status = ''
      if (filter_obj.value) {
        let trigram = BOOK.loadTrigram(filter_obj.value)
        if (trigram) {
          filter_status = trigram.titleElement
        } else {
          console.log('Main::main _init_filter_from_query could not load a Trigram from the filter value')
        }
      }
      VIEW.clearStatus()
      switch(filter_obj.action) {
        case 'all' :
          result = _init_render( BOOK.getHexagramsAll() )
          break
        case 'sovereign' :
          result = _init_render( BOOK.getSovereignHexagrams() )
          VIEW.showFilterStatus('sovereign')
          break
        case 'inner' :
          result = _init_render( BOOK.getInnerHexagrams() )
          VIEW.showFilterStatus('inner')
          break
        case 'innermost' :
          result = _init_render( BOOK.getInnermostHexagrams() )
          VIEW.showFilterStatus('innermost')
          break
        case 'bottom' :
          result = _init_render( BOOK.getHexagramsByTrigram(filter_obj.value,0) )
          if (result && filter_status) {
            VIEW.showTrigramFilterStatus(filter_status,0)
          }
          break
        case 'top' :
          result = _init_render( BOOK.getHexagramsByTrigram(filter_obj.value,1) )
          if (result && filter_status) {
            VIEW.showTrigramFilterStatus(filter_status,1)
          }
          break
        default :
          console.log('Main::main _init_filter_from_query was passed an unrecongized parameter.')
      }
      return result
    }


    // PROCEDURE:
    let view
    if (window.location.search) {
      // Populate the UI accoridng to the URL query, or . . .
      const REQUEST = new Request(window.location)
      view = _init_filter_from_query(REQUEST.getHexagramFilter())
    } else {
      view = null
    }
    if (!view) {
       // Populate the UI from a pre-set filter; in the case, filter for "all"
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
      VIEW.clearStatus()
      VIEW.showTrigramFilterStatus(
        library.tri_names_arr[Number(FILTERMENU.selectTrigram.value)][0],
        Number(FILTERMENU.selectHexSegment.value)
      )
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
        VIEW.clearStatus()
        VIEW.showTrigramFilterStatus(
          library.tri_names_arr[Number(FILTERMENU.selectTrigram.value)][0],
          Number(FILTERMENU.selectHexSegment.value)
        )
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
