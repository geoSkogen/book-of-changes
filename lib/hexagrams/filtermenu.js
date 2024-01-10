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
      let modal_is_hidden = JSON.parse(SELF.#appElement.getAttribute('aria-hidden'))
      if (modal_is_hidden) {
        SELF.show()
      } else {
        SELF.hide()
      }
    })
    this.#openElement.addEventListener('keyup', function (event) {
      if (event.code === 'Enter') {
        let modal_is_hidden = JSON.parse(SELF.#appElement.getAttribute('aria-hidden'))
        if (modal_is_hidden) {
          SELF.show()
        } else {
          SELF.hide()
        }
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
    document.body.addEventListener('keydown', function (event) {
      if (event.code==='Escape') {
        if (!JSON.parse(SELF.#appModal.getAttribute('aria-hidden'))) {
          SELF.hideModal()
        }
        if (!JSON.parse(SELF.#appElement.getAttribute('aria-hidden'))) {
          SELF.hide()
        }
      }
    })
  }

  /**
  * @return DOM Element
  */
  get filterMenu() {
    return this.#filterMenu
  }

  /**
  * @return DOM Element
  */
  get filterSubmit() {
    return this.#filterSubmit
  }

  /**
  * @return DOM Element
  */
  get selectTrigram() {
    return this.#selectTrigram
  }

  /**
  * @return DOM Element
  */
  get selectHexSegment() {
    return this.#selectHexSegment
  }

  show() {
    this.#appElement.setAttribute('aria-hidden','false')
    document.getElementById('modal-backdrop').className = 'show'
    if (this.#filterMenu.value==='4') {
      this.showModal()
      this.#selectTrigram.focus()
    } else {
      this.#filterMenu.focus()
    }
    this.togglePageAccessibilityTree(true)
  }

  hide() {
    this.#appElement.setAttribute('aria-hidden','true')
    this.#appModal.setAttribute('aria-hidden','true')
    document.getElementById('modal-backdrop').className = 'hide'
    this.togglePageAccessibilityTree(false)
    this.#openElement.focus()
  }

  showModal() {
    this.#appModal.setAttribute('aria-hidden','false')
    document.getElementById('modal-backdrop').className = 'show'
    this.#selectTrigram.focus()
  }

  hideModal() {
    this.#appModal.setAttribute('aria-hidden','true')
    this.#filterMenu.focus()
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

    tab_element_collections.push([this.#openElement])

    tab_element_collections.forEach( (tab_element_collection) => {
      tab_element_collection.forEach( (tab_element) => {
        tab_element.setAttribute('tabindex',tab_index_val)
      })
    })
  }

}
