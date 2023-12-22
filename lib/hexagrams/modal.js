class Modal {

  #appElement = {}
  #panels = []
  #closeModalElement = {}
  #modalBackdrop = {}
  #lastSelectedHexId = ''

  constructor() {

    const SELF = this
    this.#appElement = document.getElementById('hex-modal')
    this.#closeModalElement = document.getElementById('close-hex-modal')
    this.#modalBackdrop = document.getElementById('modal-backdrop')

    if (typeof ModalPanel === 'function') {
      this.#panels[0] = new ModalPanel(1)
      this.#panels[1] = new ModalPanel(2)
    }

    this.#closeModalElement.addEventListener('click', function (event) {
      SELF.hide()
    })

    this.#closeModalElement.addEventListener('keyup', function (event) {
      if (event.code === 'Enter') {
        SELF.hide()
      }
    })

    document.body.addEventListener('keydown', function (event) {
      if (event.code==='Escape') {
        if (!JSON.parse(SELF.#appElement.getAttribute('aria-hidden'))) {
          document.getElementById(SELF.#lastSelectedHexId).focus()
          SELF.hide()
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

     } else {
       console.log('Modal::show expects a Hexagram object in index 0 of its array argument.')
     }
  }

  hide() {
    this.fadeOut()
  }
}
