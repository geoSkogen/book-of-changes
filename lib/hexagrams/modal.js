class Modal {

  #appElement = {}
  #panels = []
  #closeModalElement = {}
  #modalBackdrop = {}
  #lastSelectedHexId = ''

  constructor() {
    if (typeof ModalPanel === 'function') {
      const SELF = this
      this.#appElement = document.getElementById('hex-modal')
      this.#closeModalElement = document.getElementById('close-hex-modal')
      this.#modalBackdrop = document.getElementById('modal-backdrop')
      this.#panels[0] = new ModalPanel(1)
      this.#panels[1] = new ModalPanel(2)

      this.#closeModalElement.addEventListener('click', function (event) {
        SELF.hide()
      })
      this.#closeModalElement.addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
          SELF.hide()
        }
      })
    } else {
      console.log('Modal::constructor could not locate the Panel class definition.')
    }
  }

  show(hexagrams) {
    if (typeof Hexagram === 'function') {
      if (Array.isArray(hexagrams)) {
         if (hexagrams[0] instanceof Hexagram) {
           this.#appElement.setAttribute('aria-hidden','false')
           this.#modalBackdrop.className = 'show'
           this.#panels[0].reset()
           this.#panels[1].reset()
           this.#panels[0].loadHexagram(hexagrams[0])
           if (hexagrams[1] instanceof Hexagram) {
             this.#panels[1].loadHexagram(hexagrams[1])
           } else {
            console.log('Modal::show did not get a second Hexagram object.')
           }
         } else {
           console.log('Modal::show expects a Hexagram object in index 0 of its array argument.')
         }
      } else {
        console.log('Modal::show expects an array as an arugment.')
      }
    } else {
      console.log('Modal::show could not locate the Hexagram class definition.')
    }
  }

  hide() {
    this.#appElement.setAttribute('aria-hidden','true')
    this.#modalBackdrop.className = 'hide'
  }
}
