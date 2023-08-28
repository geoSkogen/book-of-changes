class View {

  #lineButtons
  #firstHexName
  #secondHexName

  constructor() {
    this.#lineButtons = document.getElementsByClassName('line-button')
    this.#firstHexName = document.getElementById('first-hex-name')
    this.#secondHexName = document.getElementById('second-hex-name')
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

  toggleLine(line_index) {
    if (typeof line_index === 'number') {
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
        console.log('View::toggle line was passed a line index out of range.')
      }
    } else {
      console.log('View::toggleLine expects an integer as argument 1.')
    }
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
      if (hexagram_obj instanceof Hexagram) {
        let hexagram_name_str =
          hexagram_obj.number.toString() + ' | ' + hexagram_obj.title['canonical']
        switch(hexagram_index) {
          case 0 :
            this.#firstHexName.innerText = hexagram_name_str
            break
          case 1 :
            this.#secondHexName.innerText = hexagram_name_str
            break
          default :
        }
      } else {
        console.log('View::showHexagramNames expects a Hexagram object as arugment 1.')
      }
    } else {
      console.log('View::showHexagramNames expects an integer 0 or 1 as argument 2.')
    }
  }
}
