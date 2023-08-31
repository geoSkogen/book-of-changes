class View {

  #tabs = []
  #panels = []

  constructor() {
    this.#tabs = document.getElementsByClassName('menu-tab')
    this.#panels = document.getElementsByClassName('hexagram-menu')
    const SELF = this
    for (let i = 0; i < this.#tabs.length; i++) {
      SELF.#tabs[i].addEventListener('click', function (event) {
        SELF.showPanel(event.target.getAttribute('aria-controls'))

        console.log('View::constructor tab button click listener')
      })
      SELF.#tabs[i].addEventListener('click', function (event) {
        if (event.code === 'Enter') {
          SELF.showPanel(event.target.getAttribute('aria-controls'))
        }
      })
    }
  }

  get panels() {
    return this.#panels
  }

  showPanel(panel_id) {
    if (typeof panel_id === 'string') {
      if (document.getElementById(panel_id)) {
        for (let i = 0; i < this.#panels.length; i++) {
          if (this.#panels[i].id === panel_id) {
            this.#panels[i].setAttribute('aria-hidden','false')
            this.#tabs[i].setAttribute('aria-selected','true')
          } else {
            this.#panels[i].setAttribute('aria-hidden','true')
            this.#tabs[i].setAttribute('aria-selected','false')
          }
        }
      } else {
        console.log('View::showPanel could not locate the DOM element with the ID passed as argument 1.')
      }
    } else {
      console.log('View::showPanel expects a string as argument 1.')
    }
  }

  renderHexagrams(hexagrams) {
    let panel_index = 0
    let link_index = 0
    if (Array.isArray(hexagrams)) {
      if (typeof Hexagram === 'function') {
        hexagrams.forEach( (hexagram) => {
          if (hexagram instanceof Hexagram) {
            if (this.#panels[panel_index]) {
              let hex_link = this.getHexagramLink(hexagram)
              if (hex_link) {
                this.#panels[panel_index].appendChild(hex_link)
              } else {
                console.log('View::renderHexagrams did not get a valid DOM node for: ' + hexagram.number)
              }
            } else {
              console.log('View::renderHexagrams could not locate tab panel index: ' + panel_index.toString())
            }
            if (link_index+1===((panel_index+1)/4) * hexagrams.length) {
              panel_index++
            }
            link_index++
          } else {
            console.log('View::renderHxagrams expects an array of Hexagram objects.')
          }
        })
      } else {
        console.log('View::renderHexagrams could not locae the Hexagram class definition.')
      }
    } else {
      console.log('View::renderHexagrams expects an array as an argument.')
    }
  }

  getHexagramLink(hexagram) {
    let hex_link = null
    if (typeof Hexagram === 'function') {
      if (hexagram instanceof Hexagram) {
        let hex_link = document.createElement('a')
        let lines_el = document.createElement('div')
        let name_el = document.createElement('div')
        let char_el = document.createElement('div')

        hex_link.href = '#/' + hexagram.number.toString() + '/'
        hex_link.className = 'hex-frame'
        hex_link.id = 'hexagram-menu-link-' + hexagram.number.toString()

        lines_el.innerText = hexagram.lineCharacter
        name_el.innerText = hexagram.title['original'] + ' | ' +
          hexagram.title['canonical'] + ' | ' + hexagram.title['alias']
        char_el.innerText = hexagram.character

        lines_el.className = 'lines-frame'
        name_el.className = 'name-frame'
        char_el.className = 'char-frame'


        hex_link.appendChild(lines_el)
        hex_link.appendChild(name_el)
        hex_link.appendChild(char_el)
        return hex_link
      } else {
        console.log('View::getHexagramLink expects a Hexagram object as an argument.')
        return null
      }
    } else {
      console.log('View::getHexagramLink could not locae the Hexagram class definition.')
      return null
    }
  }
}
