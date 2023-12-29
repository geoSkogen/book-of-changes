class Modal {

  #appElement = {}
  #panels = []
  #closeModalElement = {}
  #titleFocusElement = {}
  #modalBackdrop = {}
  #lastSelectedHexId = ''

  constructor() {

    const SELF = this
    this.#appElement = document.getElementById('hex-modal')
    this.#closeModalElement = document.getElementById('close-hex-modal')
    this.#modalBackdrop = document.getElementById('modal-backdrop')
    this.#titleFocusElement = document.getElementById('hex-title-focusable')

    if (typeof ModalPanel === 'function') {
      this.#panels[0] = new ModalPanel(1)
      this.#panels[1] = new ModalPanel(2)
    }

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
  * @param array hexagrams - array of Hexagram objects
  * @param DOMElement selected_element
  * @return void
  */
  show(hexagrams,selected_element) {

    if (typeof Hexagram != 'function') {
      console.log('Modal::show could not locate the Hexagram class definition.')
      return
    }
    if (!Array.isArray(hexagrams)) {
      console.log('Modal::show expects an array as an arugment.')
      return
    }

     if (hexagrams[0] instanceof Hexagram) {
       this.#appElement.style.opacity = 0
       this.#appElement.setAttribute('aria-hidden','false')
       this.#modalBackdrop.className = 'show'

       this.#panels[0].reset()
       this.#panels[1].reset()
       this.#panels[0].loadHexagram(hexagrams[0])

       this.#lastSelectedHexId = selected_element.id

       if (hexagrams[1] instanceof Hexagram) {
         this.#panels[1].loadHexagram(hexagrams[1])
       } else {
         this.#panels[1].hide()
         //console.log('Modal::show did not get a second Hexagram object.')
       }

       this.fadeIn()
       this.togglePageAccessibilityTree(true)
       this.#titleFocusElement.focus()

     } else {
       console.log('Modal::show expects a Hexagram object in index 0 of its array argument.')
     }
  }

  /**
  * @param Event event - DOM event
  * @return void
  */
  hide(event) {
    this.fadeOut()
    if (this.#lastSelectedHexId) {
      document.getElementById(this.#lastSelectedHexId).setAttribute('aria-expanded','false')
      document.getElementById('app').setAttribute('aria-hidden','false')
      // Bug fix against aria-expanded toggling back to true when the element receives focus
      event.stopPropagation()
      this.togglePageAccessibilityTree(false)
      document.getElementById(this.#lastSelectedHexId).focus()
      this.#lastSelectedHexId = ''
    }
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

    tab_element_collections.forEach( (tab_element_collection) => {
      tab_element_collection.forEach( (tab_element) => {
        tab_element.setAttribute('tabindex',tab_index_val)
      })
    })
  }
}
