class Modal {

  #appElement = {}
  #closeModalElement = {}


  constructor() {
    this.#appElement = document.querySelector('#hex-modal')
    this.#closeModalElement = document.querySelector('#close-hex-modal')
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

  loadHexagramData() {

  }
}
