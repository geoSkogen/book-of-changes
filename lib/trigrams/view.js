class View {

  #trigramLinks = []
  #iconButton = {}
  #selectedTrigramIdsBySegment = {
    top: '', bottom : ''
  }

  constructor() {
    this.#trigramLinks = document.getElementsByClassName('trigram-char')
    if (typeof IconButton === 'function') {
      this.#iconButton = new IconButton()
    } else {
      console.log('View::constructor could not locate the IconButton class definition.')
    }
  }

  get trigramLinks() {
    return this.#trigramLinks
  }

  get iconButton() {
    return this.#iconButton
  }

  renderTrigramsMenu(trigrams) {
    if (Array.isArray(trigrams)) {
      trigrams.forEach( (trigram) => {
        this.renderTrigram(trigram)
      })
    }
  }

  renderTrigram(trigram) {
    if (typeof Trigram === 'function') {
      if (trigram instanceof Trigram) {
        if (this.#trigramLinks[trigram.number-1]) {
          let line_char_span = this.#trigramLinks[trigram.number-1].querySelector('.tri-lines-char')
          let name_span = this.#trigramLinks[trigram.number-1].querySelector('.tri-lines-name')
          if (line_char_span && name_span) {
            line_char_span.appendChild(document.createTextNode(trigram.lineCharacter))
            name_span.appendChild(document.createTextNode(trigram.titleElement))
          } else {
            console.log('View::renderTrigram could not locate the expected text field elements.')
          }
          this.#trigramLinks[trigram.number-1].href = '#' + trigram.titleElement
          this.#trigramLinks[trigram.number-1].id = trigram.number
          this.#trigramLinks[trigram.number-1].setAttribute('aria-selected','false')
        }
      } else {
        console.log('View::renderTrigram expects a Trigram object as an argument.')
      }
    } else {
      console.log('View::renderTrigram could not locate the Trigram class definition.')
    }
  }

  toggleTrigram(id_str) {
    let toggle = null
    let result = {
      toggle : null
    }
    if (JSON.parse(this.#trigramLinks[Number(id_str)-1].getAttribute('aria-selected'))) {
      toggle = this.unselectTrigram(id_str)
      if (toggle) {
        result.toggle = false
        result.hexSegment = toggle
      }
    } else {
      toggle = this.selectTrigram(id_str)
      if (toggle) {
        result.toggle = true
        result.hexSegment = toggle
      }
    }
    return result
  }

  selectTrigram(id_str) {
    let result = ''
    if (!this.#selectedTrigramIdsBySegment.bottom) {
      this.#selectedTrigramIdsBySegment.bottom = id_str
      this.#trigramLinks[Number(id_str)-1].setAttribute('aria-selected','true')
      this.#trigramLinks[Number(id_str)-1].setAttribute('data-selected','bottom')
      result = 'bottom'
    } else if (!this.#selectedTrigramIdsBySegment.top) {
      this.#selectedTrigramIdsBySegment.top = id_str
      this.#trigramLinks[Number(id_str)-1].setAttribute('aria-selected','true')
      this.#trigramLinks[Number(id_str)-1].setAttribute('data-selected','top')
      result = 'top'
    } else {
      console.log('View::selectTrigram - the maximum number of trigrams already selected.')
    }
    return result
  }

  unselectTrigram(id_str) {
    let result = ''
    if (
      this.#selectedTrigramIdsBySegment[
        this.#trigramLinks[Number(id_str)-1].getAttribute('data-selected')
      ]
    )
    {
      this.#selectedTrigramIdsBySegment[
        this.#trigramLinks[Number(id_str)-1].getAttribute('data-selected')
      ] = ''
      result = this.#trigramLinks[Number(id_str)-1].getAttribute('data-selected')
      this.#trigramLinks[Number(id_str)-1].setAttribute('aria-selected','false')
      this.#trigramLinks[Number(id_str)-1].removeAttribute('data-selected')
    } else {
      console.log('View::unselectTrigram was passed a trigram ID that is not selected.')
    }
    return result
  }
}
