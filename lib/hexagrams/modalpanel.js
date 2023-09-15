class ModalPanel {

  #appElement = {}
  #number = {}
  #lineCharacter = {}
  #character = {}
  #name = {}

  #titleOriginal = ''
  #titleCanonical = ''
  #titleAlias = ''

  #read = {}
  #inner = {}
  #innermost = {}

  constructor(index_int) {
    if (typeof index_int === 'number') {
      this.appElement = document.getElementById('hex-modal-content-' + index_int.toString())
      this.#number = document.getElementById('hex-number-' + index_int.toString())
      this.#lineCharacter = document.getElementById('hex-lines-' + index_int.toString())
      this.#character = document.getElementById('hex-char-' + index_int.toString())
      this.#name = document.getElementById('hex-name-' + index_int.toString())

      this.#titleOriginal = document.getElementById('hex-title-original-' + index_int.toString())
      this.#titleCanonical = document.getElementById('hex-title-canonical-' + index_int.toString())
      this.#titleAlias = document.getElementById('hex-title-alias-' + index_int.toString())

      this.#read = document.getElementById('read-link-' + index_int.toString())
      this.#inner = document.getElementById('inner-link-' + index_int.toString())
      this.#innermost = document.getElementById('innermost-link-' + index_int.toString())
    } else {
      console.log('Panel::constructor expects an integer as an argument.')
    }
  }

  reset() {
    this.#number.innerText = ''
    this.#lineCharacter.innerText = ''
    this.#character.innerText = ''
    this.#name.innerText = ''

    this.#titleOriginal.innerText = ''
    this.#titleCanonical.innerText = ''
    this.#titleAlias.innerText = ''

    this.#read.href = ''
    this.#inner.href = ''
    this.#innermost.href = ''
  }

  loadHexagram(hexagram) {
    if (typeof Hexagram === 'function') {
      if (hexagram instanceof Hexagram) {
        let hex_title_obj = hexagram.title
        this.#number.innerText = hexagram.number
        this.#lineCharacter.innerText = hexagram.lineCharacter
        this.#character.innerText = hexagram.character
        this.#name.innerText = hexagram.name

        this.#titleOriginal.innerText = hex_title_obj.original
        this.#titleCanonical.innerText = hex_title_obj.canonical
        this.#titleAlias.innerText = hex_title_obj.alias

        this.#read.href = '../build/#/' + hexagram.number.toString() + '/#/0'
        this.#inner.href = '#/' + hexagram.innerHexagramIndex.toString()
        this.#innermost.href = '#/' + hexagram.innermostHexagramIndex.toString()
      } else {
        console.log('Panel::show expects a hexagram as an argument.')
      }
    } else {
      console.log('Panel::show could not locate the Hexagram class definition.')
    }
  }
}
