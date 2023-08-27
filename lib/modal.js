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
    this.#generalPurports['inner'] = document.getElementById('hex-meta-inner')

    this.#movingLines['inner'] = document.getElementById('moving-lines-inner')
    this.#movingLines['outer'] = document.getElementById('moving-lines-outer')
  }

  get closeModalElement() {
    return this.#closeModalElement
  }

  show() {
    this.#appElement.setAttribute('aria-hidden','false')
  }

  hide() {
    this.#appElement.setAttribute('aria-hidden','true')
  }

  showHexagram(hexagram_arg) {
    if (hexagram_arg instanceof Hexagram) {
      this.#loadHexagram(hexagram_arg)
      this.#show()
    } else {
      console.log('Modal::showHexagram expects a Hexagram object as an argument.')
    }
  }

  loadHexagram(hexagram_obj) {
    const SELF = this
    this.#number.innerText = hexagram_obj.number
    // Titles
    for (let i = 0; i < this.#titles.length; i++) {

      let title_prop = (this.#titles[i].id typeof === 'string') ?
        this.#titles[i].replace('hex-title-','') : ''

      if (hexagram_obj.title[title_prop]) {
        this.#titles[i][title_prop].innerText = hexagram_obj.title[title_prop]
      }
    }

    ['inner','outer'].forEach( (line_set_str) => {
      SELF.addGeneralPurport( hexagram_obj.getGeneralPurport(line_set_str))
      if (hexagram_obj.isMoving) {
        SELF.addMovingLines( hexagram_obj.getMovingLinesPurports(line_set_str))
      } else {
        SELF.addStillLine( hexagram_obj.getStillLinesPurport(line_set_str))
      }
    })
  }

  addGeneralPurport(text,line_set) {
    if (this.#generalPurports[line_set]) {
      if (typeof text === 'string') {
        this.#generalPurports[line_set].innerText = text
      }
    }
  }

  addStillLine(text,line_set) {
    if (this.#movingLines[line_set]) {
      if (typeof text === 'string') {
        this.#movingLines[line_set].innerText = text
      }
    }
  }

  addMovingLines(line_text_arr,line_set) {
    if (Array.isArray(line_text_arr) && line_text_arr.length) {
      let ul = document.createElement('ul')
      line_text_arr.forEach( (line_text) => {
        let line_el = getMovingLineItem(line_text,line_set)
        if (line_el) {
          ul.appendChild(line_el)
        }
      })
      if (this.#movingLines[line_set]) {
        this.#movingLines[line_set].appendChild(ul)
      }
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
      }
    }
    return result
  }

}
