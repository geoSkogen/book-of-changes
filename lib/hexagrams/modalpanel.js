class ModalPanel {

  #appElement = {}
  #number = {}
  #lineCharacter = {}
  #character = {}
  #name = {}

  #titleOriginal = ''
  #titleCanonical = ''
  #titleAlias = ''

  #readLink = {}
  #alterLink = {}
  #innerLink = {}
  #innermostLink = {}

  constructor(index_int) {

    if (typeof index_int != 'number') {
      console.log('Panel::constructor expects an integer as an argument.')
      return
    }

    this.#appElement = document.getElementById('hex-modal-content-' + index_int.toString())
    this.#number = document.getElementById('hex-number-' + index_int.toString())
    this.#lineCharacter = document.getElementById('hex-lines-' + index_int.toString())
    this.#character = document.getElementById('hex-char-' + index_int.toString())
    this.#name = document.getElementById('hex-name-' + index_int.toString())

    this.#titleOriginal = document.getElementById('hex-title-original-' + index_int.toString())
    this.#titleCanonical = document.getElementById('hex-title-canonical-' + index_int.toString())
    this.#titleAlias = document.getElementById('hex-title-alias-' + index_int.toString())

    this.#readLink = document.getElementById('read-link-' + index_int.toString())
    this.#alterLink = document.getElementById('alter-link-' + index_int.toString())
    this.#innerLink = document.getElementById('inner-link-' + index_int.toString())
    this.#innermostLink = document.getElementById('innermost-link-' + index_int.toString())
  }


  reset() {
    this.#number.innerText = ''
    this.#lineCharacter.innerText = ''
    this.#character.innerText = ''
    this.#name.innerText = ''

    this.#titleOriginal.innerText = ''
    this.#titleCanonical.innerText = ''
    this.#titleAlias.innerText = ''

    this.#readLink.href = ''
    this.#innerLink.href = ''
    this.#innermostLink.href = ''
  }


  hide() {
    this.#appElement.setAttribute('aria-hidden','true')
    document.getElementById('hex-mover-d').setAttribute('aria-hidden','true')
  }

  /**
  * @param Hexagram hexagram
  * @return void
  */
  loadHexagram(hexagram) {

    if (typeof Hexagram != 'function') {
      console.log('ModalPanel::show could not locate the Hexagram class definition.')
      return
    }

    if (hexagram instanceof Hexagram) {
      let hex_title_obj = hexagram.title
      this.#number.innerText = hexagram.number
      this.#lineCharacter.innerText = hexagram.lineCharacter
      this.#character.innerText = hexagram.character
      this.#name.innerText = hexagram.name

      this.#titleOriginal.innerText = hex_title_obj.original
      this.#titleCanonical.innerText = hex_title_obj.canonical
      this.#titleAlias.innerText = hex_title_obj.alias

      this.#readLink.innerText = 'generate ' + hex_title_obj.canonical
      this.#alterLink.innerText = 'alter ' + hex_title_obj.canonical

      this.#readLink.href = '../?id=' + hexagram.number.toString()
      this.#alterLink.href = '../build/?id=' + hexagram.number.toString()
      this.#innerLink.href = '../?id=' + hexagram.innerHexagramIndex.toString()
      this.#innermostLink.href = '../?id=' + hexagram.innermostHexagramIndex.toString()


      this.#appElement.setAttribute('aria-hidden','false')
    } else {
      console.log('Panel::show expects a hexagram as an argument.')
    }
  }
}
