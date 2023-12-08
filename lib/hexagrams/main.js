(function () {

const MAIN = {

  main : function() {

    if (
      typeof Book === 'function' &&
      typeof Builder === 'function' &&
      typeof View === 'function' &&
      typeof Modal === 'function' &&
      typeof FilterMenu === 'function'
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
        const FILTERMENU = new FilterMenu()
        const HEXAGRAMS = BOOK.getHexagramsAll()

        // FUNCTIONS
        function _get_hex_element_index(hex_element) {
          if (typeof hex_element === 'object') {
            if (hex_element.id && typeof hex_element.id === 'string') {
              let hex_index_arg = hex_element.id.replace('hexagram-menu-link-','')
              if (!isNaN(hex_index_arg)) {
                let index = Number(hex_index_arg)-1
                return index
              } else {
                console.log('MAIN::main _get_hex_element_index was passed a DOM element with an unrecognized')
              }
            } else {
              console.log('MAIN::main _get_hex_element_index expects a DOM element with an ID attribute.')
            }
          } else {
            console.log('MAIN::main _get_hex_element_index expects a DOM element as an argument.')
          }
        }

        function _init_select(hex_element) {
          let hexagram = HEXAGRAMS[_get_hex_element_index(hex_element)]
          let toggle_resp = VIEW.selectHexagram(hexagram.number,0)
          MODAL.show([hexagram],hex_element)
        }

        function _init_render(hexagrams) {
          if (Array.isArray(hexagrams)) {

            VIEW.renderHexagrams(hexagrams)
            VIEW.showPanel(VIEW.panels[0].id)

            for (let i = 0; i < VIEW.hexagrams.length; i++) {

              let hex_element = VIEW.hexagrams[i]

              hex_element.addEventListener('click', function (event) {
                _init_select(hex_element)
              })
            }
          } else {
            console.log('MAIN::main _init_render expects an array as an argument.')
          }
          return null
        }

        function _init_trigram_filter(trigram_arg,hex_half_arg) {
          let hexagrams = null
          if (typeof trigram_arg === 'number') {
            if (typeof hex_half_arg === 'number') {
              hexagrams = BOOK.getHexagramsByTrigram(trigram_arg,hex_half_arg)
            } else {
              console.log('MAIN::main _init_trigram_filter_render expects an integer as argument 2.')
            }
          } else {
            console.log('MAIN::main _init_trigram_filter_render expects an integer as argument 1.')
          }
          return hexagrams
        }

        function _init_filter(filter_arg) {
          let result = null
          if (typeof filter_arg === 'number') {
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
          } else {
            console.log('MAIN::main _init_filter expects an integer as an arugment.')
          }
          return result
        }

        // PROCEDURE
        _init_render(_init_filter(0))

        // EVENT LISTENERS
        FILTERMENU.filterMenu.addEventListener('input', function (event) {
          _init_render(_init_filter( Number(event.target.value)))
        })

        FILTERMENU.filterSubmit.addEventListener('click', function (event) {
          _init_render(
            _init_trigram_filter(
              Number(FILTERMENU.selectTrigram.value),
              Number(FILTERMENU.selectHexSegment.value)
            )
          )
          FILTERMENU.hideModal()
        })

        FILTERMENU.filterSubmit.addEventListener('keyup', function (event) {
          if (event.code === 'Enter') {
            _init_render(
              _init_trigram_filter(
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
    } else {
      console.log("MAIN::main could not locate class definitions for Book, Builder, View, Modal, and FilterMenu")
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
