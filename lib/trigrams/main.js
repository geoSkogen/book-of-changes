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
      console.log("MAIN::main could not locate class definitions for Book, Builder, View, and Modal")
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
    const TRIGRAMS = BOOK.getTrigramsAll()

    // FUNCTIONS:
    /**
    * Select or un-select a trigram element
    * @param string trigram_number_str
    */
    function _init_trigram_toggle(trigram_number_str) {

      BUILDER.toggleTrigram(
        TRIGRAMS[Number(trigram_number_str)-1],
        VIEW.toggleTrigram(trigram_number_str),
        0
      )

      VIEW.iconButton.renderHexagramIcon(
        BUILDER.getTrigramsLineConfig(0)
      )
    }

    // PROCEDURE:
    VIEW.renderTrigramsMenu(TRIGRAMS)

    // USER INTERFACE EVENT LISTENERS:
    for (let i = 0; i < VIEW.trigramLinks.length; i++) {
      let link = VIEW.trigramLinks[i]
      link.addEventListener('click', function (event) {
        _init_trigram_toggle(link.id)
      })
      link.addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
          //_init_trigram_toggle(link.id)
        }
      })
    }

    VIEW.iconButton.button.addEventListener('click', function (event) {
      MODAL.show(
        BOOK.getHexagramByLineConfig(
          BUILDER.getTrigramsLineConfig(0).join('')
        )
      )
    })
    VIEW.iconButton.button.addEventListener('keyup', function (event) {
      if (event.code === 'Enter') {
        /*
        MODAL.show(
          BOOK.getHexagramByLineConfig(
            BUILDER.getTrigramsLineConfig(0).join('')
          )
        )
        */
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
