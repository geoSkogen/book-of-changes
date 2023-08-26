class Modal {

  #appElement = {}
  #closeModalElement = {}

  #generalPurports = {}
  #movingLines = {}


  constructor() {
    this.#appElement = document.getElementById('hex-modal')
    this.#closeModalElement = document.getElementById('close-hex-modal')

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

  loadHexagrams() {

  }

  addGeneralPurport(text,line_set) {
    if (this.#generalPurports[line_set]) {
      if (typeof text === 'string') {
        this.#generalPurports[line_set].innerText = text
      }
    }
  }

  addMovingLineItem(text,line_set) {
    if (this.#movingLines[line_set]) {
      if (typeof text === 'string') {
        let li = document.createElement('li')
        li.className = 'moving-line-item'
        li.innerText = text
        this.#movingLines[line_set].appendChild(li)
      }
    }
  }
  
}
