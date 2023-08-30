class View {

  #lineButtons = []
  #firstHexName = {}
  #secondHexName = {}
  #hexMoverIcon = {}

  #trigrams = {}

  constructor() {
    this.#lineButtons = document.getElementsByClassName('line-button')
    this.#firstHexName = document.getElementById('first-hex-name')
    this.#secondHexName = document.getElementById('second-hex-name')
    this.#hexMoverIcon = document.getElementById('hex-mover')

    this.#trigrams = [
      [
        document.getElementById('first-trigram-bottom'),
        document.getElementById('first-trigram-top')
      ],
      [
        document.getElementById('second-trigram-bottom'),
        document.getElementById('second-trigram-top')
      ]
    ]
  }

  get lineButtons() {
    return this.#lineButtons
  }

  get firstHexNameButton() {
    return this.#firstHexName
  }

  get secondHexNameButton() {
    return this.#secondHexName
  }

  toggleLine(line_index_int,hex_index_int) {
    if (typeof line_index_int === 'number' && typeof hex_index_int === 'number') {
      let line_index = this.transformLineIndex(line_index_int,hex_index_int)
      if (this.#lineButtons[line_index]) {
        switch(this.#lineButtons[line_index].getAttribute('aria-label')) {
          case 'yin' :
            this.#lineButtons[line_index].innerHTML = ''
            this.#lineButtons[line_index].appendChild( this.innerYangLine())
            this.#lineButtons[line_index].setAttribute('aria-label','yang')
            break
          case 'yang' :
            this.#lineButtons[line_index].innerHTML = ''
            this.#lineButtons[line_index].appendChild( this.innerYinLine())
            this.#lineButtons[line_index].setAttribute('aria-label','yin')
            break
          default :
        }
      } else {
        console.log('View::toggleLine was passed a line index out of range.')
      }
    } else {
      console.log('View::toggleLine expects integers as arguments 1 and 2.')
    }
  }

  transformLineIndex(line_index_int,hex_index_int) {
    let result = null
    let line_button_index = null
    if (typeof line_index_int === 'number' && line_index_int < this.#lineButtons.length/2) {
      line_button_index = ((this.#lineButtons.length/2)-1) - line_index_int
      result = hex_index_int ? line_button_index + (this.#lineButtons.length/2) : line_button_index
    } else {
      console.log('View::transformLineIndex expects an integer within range of the button array.')
    }
    return result
  }

  getLineFieldsById(id_str) {
    let result = null
    if (typeof id_str === 'string') {
      let line_indices = id_str.split('-')
      let line_index = line_indices[0] ? Number(line_indices[0]) : null
      let hex_index = line_indices[1] ? Number(line_indices[1]) : null
      if (line_index && hex_index) {
        result = {
          lineIndex : line_index-1,
          hexIndex: hex_index-1,
          lineVal : undefined
        }
      }
    } else {
      console.log('View::getLineFieldsById expects a string as an argument.')
    }
    return result
  }

  innerYinLine() {
    const line_1 = document.createElement('div')
    const line_2 = document.createElement('div')
    const subwrapper = document.createElement('div')
    subwrapper.className = "half-line-frame flex-row flex-between"
    line_1.className = "half-line"
    line_2.className = "half-line"
    subwrapper.appendChild(line_1)
    subwrapper.appendChild(line_2)
    return subwrapper
  }

  innerYangLine() {
    const line = document.createElement('div')
    line.className = "full-line"
    return line
  }

  showHexagramName(hexagram_obj,hexagram_index) {
    if (
      typeof hexagram_index === 'number' &&
      (hexagram_index === 0 || hexagram_index === 1)
    )
    {
      if (typeof Hexagram == 'function') {
        if (hexagram_obj instanceof Hexagram) {
          let hexagram_name_str =
            hexagram_obj.number.toString() + ' | ' + hexagram_obj.title['canonical']
          switch(hexagram_index) {
            case 0 :
              this.#firstHexName.innerText = hexagram_name_str
              break
            case 1 :
              this.#secondHexName.innerText = hexagram_name_str
              this.#hexMoverIcon.setAttribute('aria-hidden','false')
              break
            default :
          }
        } else {
          console.log('View::showHexagramNames expects a Hexagram object as arugment 1.')
        }
      } else {
        cosnole.log('View::showHexagramNames could not locate a Hexagram class definition.')
      }
    } else {
      console.log('View::showHexagramNames expects an integer 0 or 1 as argument 2.')
    }
  }

  showTrigramName(trigram,tri_index,hex_index) {
    if (typeof Trigram === 'function') {
      if (trigram instanceof Trigram) {
        if (
          this.#trigrams[hex_index] &&
          this.#trigrams[hex_index][tri_index]
        )
        {
          this.#trigrams[hex_index][tri_index].innerText =
            trigram.titleElement + ' | ' + trigram.quality

        } else {
          console.log('View::showTrigrams expects integers 1 or 0 as arguments 2 and 3.')
        }
      } else {
        console.log('View::showTrigramName expects a trigram as argument 1.')
      }
    } else {
      console.log('View::showTrigams could not locate a Trigram class definiton.')
    }
  }
}
