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

  /**
  * @return HTML Collection
  */
  get panels() {
    return this.#panels
  }

  /**
  * @return DOMElement
  */
  get hexagrams() {
    return document.getElementsByClassName('hex-frame')
  }

  /**
  * @param string panel_id
  * @return void
  */
  showPanel(panel_id) {

    if (typeof panel_id != 'string') {
      console.log('View::showPanel expects a string as argument 1.')
      return
    }

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

  /**
  * @param array hexagrams - array of Hexagram objects
  * @return void
  */
  renderHexagrams(hexagrams) {
    let panel_index = 0
    let link_index = 0

    if (typeof Hexagram != 'function') {
      console.log('View::renderHexagrams could not locae the Hexagram class definition.')
      return
    }
    if (!Array.isArray(hexagrams)) {
      console.log('View::renderHexagrams expects an array as an argument.')
      return
    }

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
  }

  /**
  * @param Hexagram hexagram
  * @return DOM Element
  */
  getHexagramLink(hexagram) {
    let hex_link = null

    if (typeof Hexagram != 'function') {
      console.log('View::getHexagramLink could not locate the Hexagram class definition.')
      return null
    }

    if (hexagram instanceof Hexagram) {
      let hex_link = document.createElement('a')
      let lines_el = document.createElement('div')
      let name_el = document.createElement('div')
      let char_el = document.createElement('div')
      let icon_el = document.createElement('i')

      hex_link.href = '#/' + hexagram.number.toString() + '/'
      hex_link.className = 'hex-frame'
      hex_link.id = 'hexagram-menu-link-' + hexagram.number.toString()
      hex_link.setAttribute('aria-expanded','false')
      hex_link.setAttribute(
        'title',
        hexagram.title['original'] + ' | ' + hexagram.title['canonical']
      )

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
  }

  /**
  * @param integer hex_number
  * @param integar selection_index
  * @return string
  */
  selectHexagram(hex_number,selection_index) {

    if (typeof hex_number != 'number') {
      console.log('View::selectHexagram expects an integer as argument 1')
      return ''
    }
    if (typeof selection_index != 'number') {
      console.log('View::selectHexagram expects an integer as argument 2.')
      return ''
    }

    let result = ''
    let hex_element = document.getElementById('hexagram-menu-link-' + hex_number.toString())

    if (this.#selectedHexagramIdsByIndex[selection_index]) {
      result = this.unselectHexagram(
        this.#selectedHexagramIdsByIndex[selection_index],
        selection_index
      )
    }
    this.#selectedHexagramIdsByIndex[selection_index] = hex_number

    if (hex_element) {
      hex_element.setAttribute('aria-expanded','true')
    } else {
      console.log('View::selectHexagram did not locate a hexagram element with the ID "hexagram-menu-link-' + hex_number.toString() + '"')
    }
    return result
  }


  unselectHexagram(hex_number,selection_index) {

    if (typeof hex_number != 'number') {
      console.log('View::selectHexagram expects an integer as argument 1')
      return ''
    }
    if (typeof selection_index != 'number') {
      console.log('View::selectHexagram expects an integer as argument 2.')
      return ''
    }

    let result = ''
    let hex_element = document.getElementById('hexagram-menu-link-' + hex_number.toString())

    if (this.#selectedHexagramIdsByIndex[selection_index]) {
      result = this.#selectedHexagramIdsByIndex[selection_index]
      this.#selectedHexagramIdsByIndex[selection_index] = ''

      if (hex_element) {
        hex_element.setAttribute('aria-expanded','false')
      } else {
        console.log('View::unselectHexagram did not locate a hexagram element with the ID "hexagram-menu-link-' + hex_number.toString() + '"')
      }

    } else {
      console.log('View::unselectHexagram was passed a hexagram ID that was not selected.')
    }
    return result
  }
}
