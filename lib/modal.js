class Modal {

  #appElement = {}
  #closeModalElement = {}

  #number = {}
  #titles = []

  #generalPurports = {}
  #movingLines = {}


  constructor() {
    this.#appElement = document.getElementById('hex-modal')
    this.#closeModalElement = document.getElementById('close-hex-modal')

    this.#number = document.getElementById('hex-number')
    this.#titles = document.getElementsByClassName('hex-title')

    this.#generalPurports['inner'] = document.getElementById('hex-meta-inner')
    this.#generalPurports['outer'] = document.getElementById('hex-meta-outer')

    this.#movingLines['inner'] = document.getElementById('moving-lines-inner')
    this.#movingLines['outer'] = document.getElementById('moving-lines-outer')
  }

  get closeModalElement() {
    return this.#closeModalElement
  }

  show(toogle_button_obj) {
    this.#appElement.setAttribute('aria-hidden','false')
    if (typeof toggle_button === 'object') {
      toggle_button.setAttribute('aria-expanded','true')
    }
  }

  hide(toggle_button_obj) {
    this.#appElement.setAttribute('aria-hidden','true')
    if (typeof toggle_button === 'object') {
      toggle_button.setAttribute('aria-expanded','false')
    }
  }

  showHexagram(hexagram_arg,toggle_button_obj) {
    if (hexagram_arg instanceof Hexagram) {
      this.loadHexagram(hexagram_arg)
      this.show(toggle_button_obj)
    } else {
      console.log('Modal::showHexagram expects a Hexagram object as an argument.')
    }
  }

  loadHexagram(hexagram_obj) {
    const SELF = this
    // Title Sections
    this.#number.innerText = hexagram_obj.number
    for (let i = 0; i < this.#titles.length; i++) {

      let title_prop = (typeof this.#titles[i].id === 'string') ?
        this.#titles[i].id.replace('hex-title-','') : ''

      if (hexagram_obj.title[title_prop]) {
        this.#titles[i].innerText = hexagram_obj.title[title_prop]
      } else {
        console.log('View::loadHexagram did not find a Hexagram::title prop: ' + title_prop)
      }
    }
    // Interpretive Section
    ['inner','outer'].forEach( (line_set_str) => {

      SELF.addGeneralPurport(
        hexagram_obj.getGeneralPurport(line_set_str),
        line_set_str
      )

      if (hexagram_obj.isMoving) {
        SELF.addMovingLines(
          hexagram_obj.getMovingLinesPurports(line_set_str),
          line_set_str
        )
      } else {
        SELF.addStillLine(
          hexagram_obj.getStillLinesPurport(line_set_str),
          line_set_str
        )
      }
    })
  }

  addGeneralPurport(text,line_set) {
    if (this.#generalPurports[line_set]) {
      if (typeof text === 'string') {
        this.#generalPurports[line_set].innerText = text
      } else {
        console.log('View::addGeneralPurport expecsts a string as argument 1.')
      }
    } else {
      console.log('View::addGeneralPurport was passed a non-existent line-set value as argument 2.')
    }
  }

  addStillLine(text,line_set) {
    if (this.#movingLines[line_set]) {
      if (typeof text === 'string') {
        this.#movingLines[line_set].innerText = text
      } else {
        console.log('View::addStillLine expecsts a string as argument 1.')
      }
    } else {
      console.log('View::addStillLine was passed a non-existent line-set value as argument 2.')
    }
  }

  addMovingLines(line_text_arr,line_set) {
    if (Array.isArray(line_text_arr) && line_text_arr.length) {
      let ul = document.createElement('ul')
      line_text_arr.forEach( (line_text) => {
        let line_el = this.getMovingLineItem(line_text,line_set)
        if (line_el) {
          ul.appendChild(line_el)
        } else {
          console.log('View::addMovingLines did not return a valid line element.')
        }
      })
      if (this.#movingLines[line_set]) {
        this.#movingLines[line_set].appendChild(ul)
      } else {
        console.log('View::addMovingLines was passed a non-existent line-set value as argument 2.')
      }
    } else {
      console.log('View::addMovingLines expects an array of strings an argument 1.')
    }
  }

  getMovingLineItem(text,line_set) {
    let result = null
    if (this.#movingLines[line_set]) {
      if (typeof text === 'string') {
        let li = document.createElement('li')
        li.className = 'moving-line-item'
        li.innerText = text
        result = li
      } else {
          console.log('View::getMovingLineItem expecsts a string as argument 1.')
      }
    } else {
        console.log('View::getMovingLineItem was passed a non-existent line-set value as argument 2.')
    }
    return result
  }

}
