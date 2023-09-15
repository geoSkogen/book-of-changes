class View {

  #tabs = []
  #panels = []
  #selectedHexagramIdsByIndex = [
    '',
    ''
  ]

  constructor() {
    this.#tabs = document.getElementsByClassName('menu-tab')
    this.#panels = document.getElementsByClassName('hexagram-menu')
    const SELF = this
    for (let i = 0; i < this.#tabs.length; i++) {
      SELF.#tabs[i].addEventListener('click', function (event) {
        SELF.showPanel(event.target.getAttribute('aria-controls'))
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

  get hexagrams() {
    return document.getElementsByClassName('hex-frame')
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

  resetPanels() {
    for (let i = 0; i < this.#panels.length; i++) {
      this.#panels[i].innerHTML = ''
    }
  }

  resetTabs() {
    let tabs_to_show = Math.ceil(
      this.hexagrams.length/16
    )
    for (let i = 0; i < this.#tabs.length; i++) {
      if (i < tabs_to_show && tabs_to_show > 1) {
        this.#tabs[i].setAttribute('aria-hidden','false')
      } else {
        this.#tabs[i].setAttribute('aria-hidden','true')
      }
    }
  }

  renderHexagrams(hexagrams) {
    let panel_index = 0
    let link_index = 0
    if (Array.isArray(hexagrams)) {
      if (typeof Hexagram === 'function') {
        this.resetPanels()
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
            if (link_index+1===((panel_index+1)/this.#panels.length) * 64) {
              panel_index++
            }
            link_index++
          } else {
            console.log('View::renderHxagrams expects an array of Hexagram objects.')
          }
        })
        this.resetTabs()
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
        let icon_el = document.createElement('i')

        hex_link.href = '#/' + hexagram.number.toString() + '/'
        hex_link.className = 'hex-frame'
        hex_link.id = 'hexagram-menu-link-' + hexagram.number.toString()
        hex_link.setAttribute('aria-selected','false')

        lines_el.innerText = hexagram.lineCharacter
        name_el.innerText = hexagram.title['original'] + ' | ' +
          hexagram.title['canonical'] + ' | ' + hexagram.title['alias']
        char_el.innerText = hexagram.character
        icon_el.setAttribute('aria-hidden','true')

        lines_el.className = 'lines-frame'
        name_el.className = 'name-frame'
        char_el.className = 'char-frame'
        icon_el.className = 'fa fa-check-square selected-icon'

        hex_link.appendChild(lines_el)
        hex_link.appendChild(name_el)
        hex_link.appendChild(char_el)
        hex_link.appendChild(icon_el)
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

  toggleHexagram(id_str) {
    let toggle = null
    let result = {
      toggle : null
    }
    if (JSON.parse(this.hexagrams[Number(id_str)-1].getAttribute('aria-selected'))) {
      toggle = this.unselectHexagram(id_str)
      if (toggle) {
        result.toggle = false
        result.hexIndex = toggle
      }
    } else {
      toggle = this.selectHexagram(id_str)
      if (toggle) {
        result.toggle = true
        result.hexIndex = toggle
      }
    }
    return result
  }

  selectHexagram(id_str) {
    let result = ''
    if (!this.#selectedHexagramIdsByIndex[0]) {
      this.#selectedHexagramIdsByIndex[0] = id_str
      this.hexagrams[Number(id_str)-1].setAttribute('aria-selected','true')
      this.hexagrams[Number(id_str)-1].setAttribute('data-selected','0')
      result = '0'
    } else if (!this.#selectedHexagramIdsByIndex[1]) {
      this.#selectedHexagramIdsByIndex[1] = id_str
      this.hexagrams[Number(id_str)-1].setAttribute('aria-selected','true')
      this.hexagrams[Number(id_str)-1].setAttribute('data-selected','1')
      result = '1'
    } else {
      console.log('View::selectHexagram - maximum number of hexagrams already selected.')
    }
    return result
  }

  unselectHexagram(id_str) {
    let result = ''
    if (
      this.#selectedHexagramIdsByIndex[
        Number(
          this.hexagrams[Number(id_str)-1].getAttribute('data-selected')
        )
      ]
    )
    {
      result = this.hexagrams[Number(id_str)-1].getAttribute('data-selected')
      this.#selectedHexagramIdsByIndex[
        Number(
          this.hexagrams[Number(id_str)-1].getAttribute('data-selected')
        )
      ] = ''
      this.hexagrams[Number(id_str)-1].setAttribute('aria-selected','false')
      this.hexagrams[Number(id_str)-1].removeAttribute('data-selected')
    } else {
      console.log('View::unselectHexagram was passed a hexagram ID that was not selected.')
    }
    return result
  }
}
