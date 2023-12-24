class Modal {

  #appElement = null
  #modalBackdrop = null
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

    this.#modalBackdrop = document.getElementById('modal-backdrop')

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

  fadeIn() {
    const SELF = this
    let opacity = 0;
    let ease = setInterval( function () {
      if (opacity >= 1) {
        clearInterval(ease)
      } else {
        opacity+=0.05
      }
      SELF.#appElement.style.opacity = opacity
    },33)
  }

  fadeOut() {
    const SELF = this
    let opacity = 1;
    let ease = setInterval( function () {
      if (opacity <= 0) {
        SELF.#appElement.setAttribute('aria-hidden','true')
        SELF.#modalBackdrop.className = 'hide'
        clearInterval(ease)
      } else {
        opacity-=0.05
      }
      SELF.#appElement.style.opacity = opacity
    },20)
  }

  /**
  * @param Hexagram hexagram 
  */
  show(hexagram) {

    if (typeof Hexagram != 'function') {
      console.log('Modal::show could not locate the Hexagram class definition')
      return
    }

    if (hexagram instanceof Hexagram) {
      let hex_title_obj = hexagram.title
      this.#appElement.style.opacity = 0
      this.#appElement.setAttribute('aria-hidden','false')
      this.#modalBackdrop.className = 'show'
      this.fadeIn()

      this.#hexLink.href += '/' + hexagram.number.toString()
      this.#lineCharacter.innerText = hexagram.lineCharacter
      this.#character.innerText = hexagram.character

      this.#titleOriginal.innerText = hex_title_obj.original
      this.#titleCanonical.innerText = hex_title_obj.canonical
      this.#titleAlias.innerText = hex_title_obj.alias
    } else {
      console.log('Modal::show expects a Hexagram object as an argument.')
    }
  }

  hide() {
    this.fadeOut()
  }

}
