class Modal {

  #appElement = null
  #modalBackdrop = null
  #closeModalElement = null
  #openModalElement = null
  #hexLink = null
  #lineCharacter = null
  #character = null
  #name = null
  #upperTrigramName = null
  #lowerTrigramName = null
  #upperTrigramLink = null
  #lowerTrigramLink = null
  #titleOriginal = null
  #titleCanonical = null
  #titleAlias = null

  constructor() {

    const SELF = this
    this.#appElement = document.getElementById('hex-modal')
    this.#closeModalElement = document.getElementById('close-hex-modal')
    this.#openModalElement = document.getElementById('tri-hex')
    this.#modalBackdrop = document.getElementById('modal-backdrop')
    this.#hexLink = document.getElementById('hex-link')

    this.#lineCharacter = document.getElementById('hex-lines')
    this.#character = document.getElementById('hex-char')
    this.#name = document.getElementById('hex-name')

    this.#titleOriginal = document.getElementById('hex-title-original')
    this.#titleCanonical = document.getElementById('hex-title-canonical')
    this.#titleAlias = document.getElementById('hex-title-alias')

    this.#upperTrigramName = document.getElementById('upper-trigram-name')
    this.#lowerTrigramName = document.getElementById('lower-trigram-name')

    this.#upperTrigramLink = this.#upperTrigramName.parentElement
    this.#lowerTrigramLink = this.#lowerTrigramName.parentElement

    this.#closeModalElement.addEventListener('click', function (event) {
      SELF.hide(event)
    })

    this.#closeModalElement.addEventListener('keyup', function (event) {
      if (event.code === 'Enter') {
        //SELF.hide()
      }
    })

    document.body.addEventListener('keydown', function (event) {
      if (event.code==='Escape') {
        if (!JSON.parse(SELF.#appElement.getAttribute('aria-hidden'))) {
          SELF.hide(event)
        }
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
      this.#openModalElement.setAttribute('aria-expanded','true')
      this.#modalBackdrop.className = 'show'

      this.#hexLink.href = '../?id=' + hexagram.number.toString()
      this.#lineCharacter.innerText = hexagram.lineCharacter
      this.#character.innerText = hexagram.character

      this.#titleOriginal.innerText = hex_title_obj.original
      this.#titleCanonical.innerText = hex_title_obj.canonical
      this.#titleAlias.innerText = hex_title_obj.alias

      this.#lowerTrigramName.innerText = this.getTrigramTitle(hexagram.trigrams[0])

      this.#lowerTrigramLink.href = this.getHexagramsFilter(hexagram.trigrams[0],'lower')

      this.#upperTrigramName.innerText = this.getTrigramTitle(hexagram.trigrams[1])

      this.#upperTrigramLink.href = this.getHexagramsFilter(hexagram.trigrams[1],'upper')

      this.fadeIn()
      this.togglePageAccessibilityTree(true)
      this.#hexLink.focus()
    } else {
      console.log('Modal::show expects a Hexagram object as an argument.')
    }
  }

  /**
  * @param Event event - DOM event
  * @return void
  */
  hide(event) {
    this.fadeOut()
    this.#openModalElement.setAttribute('aria-expanded','false')
    // Bug fix against aria-expanded toggling back to true when the element receives focus
    event.stopPropagation()
    this.togglePageAccessibilityTree(false)
    this.#openModalElement.focus()
  }

  /**
  * Ensure tab-able and readable elements outside the modal are deactivated until the modal is closed
  * @param boolean show_modal
  * @return void
  */
  togglePageAccessibilityTree(show_modal) {
    let tab_element_collections = []
    let tab_index_val = show_modal ? '-1' : '0'
    let region_hidden_val = show_modal ? 'true' : 'false'
    if (document.querySelector('#app')) {
      tab_element_collections.push(
        document.querySelector('#app').querySelectorAll('button')
      )
      tab_element_collections.push(
        document.querySelector('#app').querySelectorAll('a')
      )
      document.querySelector('#app').setAttribute('aria-hidden',region_hidden_val)
    }
    if (document.querySelector('footer')) {
      tab_element_collections.push(
        document.querySelector('footer').querySelectorAll('button')
      )
      tab_element_collections.push(
        document.querySelector('footer').querySelectorAll('a')
      )
      document.querySelector('footer').setAttribute('aria-hidden',region_hidden_val)
    }

    tab_element_collections.push([this.#openModalElement])

    tab_element_collections.forEach( (tab_element_collection) => {
      tab_element_collection.forEach( (tab_element) => {
        tab_element.setAttribute('tabindex',tab_index_val)
      })
    })
  }

  /**
  * @param Trigram trigram
  * @return string
  */
  getTrigramTitle(trigram) {
    if (typeof Trigram != 'function') {
      console.log('Modal::getTrigramTitle could not locate the Trigram class definition.')
      return ''
    }
    if (trigram instanceof Trigram) {
      return trigram.lineCharacter + ' ' + trigram.character + ' ' + trigram.titleElement 
    } else {
      console.log('Modal::getTrigramTitle expects a Trigram object as an argument.')
      return ''
    }
  }

  /**
  * @param Trigram trigram
  * @param string hex_segment_str
  * @return string
  */
  getHexagramsFilter(trigram,hex_segment_str) {
    if (typeof hex_segment_str != 'string') {
      console.log('Modal::getHexagramsFilter expects a string as argument 2.')
      return ''
    }
    if (typeof Trigram != 'function') {
      console.log('Modal::getHexagramsFilter could not locate the Trigram class definition.')
      return ''
    }

    let result = ''
    if (trigram instanceof Trigram) {
      if (['upper','lower'].indexOf(hex_segment_str)>=0) {

        result = '../hexagrams/?segment=' + hex_segment_str + '&id=' + trigram.lines.join('')

      } else {
        console.log('Modal::getHexagramsFilter was passed an unrecognized segment string as argument 2.')
      }
    } else {
      console.log('Modal::getHexagramsFilter expects a trigram as argument 1.')
    }
    return result
  }
}
