class FilterMenu {

  #appElement = {}
  #appModal = {}

  #openElement = {}
  #closeModal = {}
  #closeElement= {}

  #filterMenu = {}
  #filterSubmit = {}

  #selectTrigram = {}
  #selectHexSegment = {}

  constructor() {
    const SELF  = this
    this.#appElement = document.getElementById('filter-menu')
    this.#appModal = document.getElementById('filter-tooltip')

    this.#openElement = document.getElementById('hex-filter-button')
    this.#closeElement = document.getElementById('close-menu-modal')
    this.#closeModal = document.getElementById('close-filter-modal')

    this.#filterMenu = document.getElementById('filter-menu-options')
    this.#filterSubmit = document.getElementById('filter-submit')

    this.#selectTrigram = document.getElementById('select-trigram')
    this.#selectHexSegment = document.getElementById('select-hex-segment')

    this.#openElement.addEventListener('click', function (event) {
      SELF.show()
    })
    this.#openElement.addEventListener('keyup', function (event) {
      if (event.code === 'Enter') {
        SELF.show()
      }
    })
    this.#closeElement.addEventListener('click', function (event) {
      SELF.hide()
    })
    this.#closeElement.addEventListener('keyup', function (event) {
      if (event.code === 'Enter') {
        SELF.hide()
      }
    })
    this.#closeModal.addEventListener('click', function (event) {
      SELF.hideModal()
    })
    this.#closeModal.addEventListener('keyup', function (event) {
      if (event.code === 'Enter') {
        SELF.hideModal()
      }
    })
  }

  get filterMenu() {
    return this.#filterMenu
  }

  get filterSubmit() {
    return this.#filterSubmit
  }

  get selectTrigram() {
    return this.#selectTrigram
  }

  get selectHexSegment() {
    return this.#selectHexSegment
  }

  show() {
    this.#appElement.setAttribute('aria-hidden','false')
  }

  hide() {
    this.#appElement.setAttribute('aria-hidden','true')
    this.#appModal.setAttribute('aria-hidden','true')
    document.getElementById('modal-backdrop').className = 'hide'
  }

  showModal() {
    this.#appModal.setAttribute('aria-hidden','false')
    document.getElementById('modal-backdrop').className = 'show'
  }

  hideModal() {
    this.#appModal.setAttribute('aria-hidden','true')
    document.getElementById('modal-backdrop').className = 'hide'
  }

}
