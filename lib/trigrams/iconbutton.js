class IconButton {

  #appElement  = {}
  #lines = []

  constructor() {
    this.#appElement = document.getElementById('tri-hex')
  }

  get lines() {
    return document.getElementByClassName('tri-hex-line')
  }

  get button() {
    return this.#appElement
  }

  getYinLine(hex_segment_str) {
    let result = null
    if (typeof hex_segment_str === 'string') {
      let line_segment_a = document.createElement('div')
      let line_segment_b = document.createElement('div')
      line_segment_a.className = 'half-yin tri-' + hex_segment_str
      line_segment_b.className = 'half-yin tri-' + hex_segment_str
      result = document.createElement('div')
      result.className = 'tri-hex-line yine-wrap flex-row flex-between'
      result.appendChild(line_segment_a)
      result.appendChild(line_segment_b)
    } else {
      console.log('View::getYinLine expects a string as an argument')
    }
    return result
  }

  getYangLine(hex_segment_str) {
    let result = null
    if (typeof hex_segment_str === 'string') {
      result = document.createElement('div')
      result.className = 'tri-hex-line tri-' + hex_segment_str
    } else {
      console.log('View::getYangLine expects a string as an arguemnt.')
    }
    return result
  }

  renderHexagramIcon(lines_arr) {
    if (Array.isArray(lines_arr)) {
      this.#appElement.innerHTML = ''
      for (let i = lines_arr.length-1; i >= 0; i--) {
        let line_element = null
        let hex_segment_str = i < 3 ? 'bottom' : 'top'
        switch(lines_arr[i]) {
          case 0 :
            line_element = this.getYinLine(hex_segment_str)
            if (line_element) {
              this.#appElement.appendChild(line_element)
            }
            break
          case 1 :
            line_element = this.getYangLine(hex_segment_str)
            if (line_element) {
              this.#appElement.appendChild(line_element)
            }
            break
          default :
            console.log('IconButton::renderHexagramIcon was passed an unrecognized line value.')
        }
        if (!line_element) {
          console.log('IconButton::renderHexagramIcon could not create a line element.')
        }
      }
    } else {
      console.log('IconButton::renderHexagramIcon expects an array as an argument.')
    }
  }
}