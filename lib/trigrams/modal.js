class Modal {

  #appElement = null
  #closeModalElement = null
  #hexLink = null
  #lineCharacter = null
  #character = null
  #name = null
  #titleOriginal = null
  #titleCanonical = null
  #titleAlias = null

  constructor() {

    const SELF = this
    this.#appElement = document.getElementById('hex-modal')
    this.#closeModalElement = document.getElementById('close-hex-modal')

    this.#hexLink = document.getElementById('hex-modal-content')

    this.#lineCharacter = document.getElementById('hex-lines')
    this.#character = document.getElementById('hex-char')
    this.#name = document.getElementById('hex-name')

    this.#titleOriginal = document.getElementById('hex-title-original')
    this.#titleCanonical = document.getElementById('hex-title-canonical')
    this.#titleAlias = document.getElementById('hex-title-alias')

    this.#closeModalElement.addEventListener('click', function (event) {
      SELF.hide()
    })

    this.#closeModalElement.addEventListener('keyup', function (event) {
      if (event.code === 'Enter') {
        SELF.hide()
      }
    })
  }

  reset() {

  }

  show(hexagram) {
    if (typeof Hexagram === 'function') {
      if (hexagram instanceof Hexagram) {
        let hex_title_obj = hexagram.title
        this.#appElement.setAttribute('aria-hidden','false')

        this.#hexLink.href += '/' + hexagram.number.toString()

        this.#lineCharacter.innerText = hexagram.lineCharacter
        this.#character.innerText = hexagram.character

        this.#titleOriginal.innerText = hex_title_obj.original
        this.#titleCanonical.innerText = hex_title_obj.canonical
        this.#titleAlias.innerText = hex_title_obj.alias
      } else {
        console.log('Modal::show expects a Hexagram object as an argument.')
      }
    } else {
      console.log('Modal::show could not locate the Hexagram class definition')
    }
  }

  hide() {
    this.#appElement.setAttribute('aria-hidden','true')
  }

}
