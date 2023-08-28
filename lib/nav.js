class Nav {

  #appElement = {}
  #openButton = {}
  #closeButton = {}

  constructor() {
    const SELF = this
    this.#appElement = document.getElementById('nav-modal')
    this.#openButton = document.getElementById('nav-hex')
    this.#closeButton = document.getElementById('close-nav-modal')

    this.#openButton.addEventListener('click', function (event) {
      SELF.show()
    })

    this.#openButton.addEventListener('keyup', function (event) {
      if (event.code==='Enter') {
        SELF.show()
      }
    })
    this.#closeButton.addEventListener('click', function (event) {
      SELF.hide()
    })

    this.#closeButton.addEventListener('keyup', function (event) {
      if (event.code==='Enter') {
        SELF.hide()
      }
    })
  }

  show() {
    this.#appElement.setAttribute('aria-hidden','false')
    this.#openButton.setAttribute('aria-expanded','true')
  }

  hide() {
    this.#appElement.setAttribute('aria-hidden','true')
    this.#openButton.setAttribute('aria-expanded','false')
  }
}
