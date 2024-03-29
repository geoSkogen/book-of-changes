class View {

  #hexagramElements = []
  #lineButton = {}
  #firstHexName = {}
  #secondHexName = {}
  #hexMoverIcon = {}
  #refreshButton = {}
  #flashFrame = {}
  #flashFrameLines = {}

  constructor() {
    this.#hexagramElements = [
      document.getElementById('wheel-inner'),
      document.getElementById('second-hex')
    ]

    this.#lineButton = document.getElementById('wheel-outer')

    this.#firstHexName = document.getElementById('first-hex-name')
    this.#secondHexName = document.getElementById('second-hex-name')
    this.#hexMoverIcon = document.getElementById('hex-mover')

    this.#refreshButton = document.getElementById('hex-refresh-button')

    this.#flashFrame = document.getElementById('line-flash-backdrop')
    this.#flashFrameLines = document.getElementsByClassName('flash-line')
  }

  /**
  * @return DOM Element
  */
  get lineButton() {
    return this.#lineButton
  }

  /**
  * @return DOM Element
  */
  get firstHexNameButton() {
    return this.#firstHexName
  }

  /**
  * @return DOM Element
  */
  get secondHexNameButton() {
    return this.#secondHexName
  }

  /**
  * @return DOM Element
  */
  get refreshButton() {
    return this.#refreshButton
  }

  /**
  * @return DOM Element
  */
  get flashFrame() {
    return this.#flashFrame
  }

  reset() {
    this.#hexagramElements[0].innerHTML = ''
    this.#hexagramElements[1].innerHTML = ''

    this.#firstHexName.innerHTML = ''
    this.#secondHexName.innerHTML = ''

    this.#firstHexName.setAttribute('aria-hidden','true')
    this.#secondHexName.setAttribute('aria-hidden','true')

    this.#hexMoverIcon.setAttribute('aria-hidden','true')
  }

  /**
  * Generate a hexagram line and append it to the DOM
  * @param string line_arg_val
  * @param integer hex_priority_int
  * @param integer line_index
  * @return void
  */
  addLine(line_arg_val,hex_priority_int,line_index) {

    if (typeof line_arg_val != 'string') {
      console.log('View::addLine expects a string as argument 1.')
      return
    }
    if (typeof hex_priority_int != 'number') {
      console.log('View::addLine expects an integer as argument 2.')
      return
    }
    if (!this.#hexagramElements[hex_priority_int]) {
      console.log('View::addLine was passed a hex priority index that is out of range.')
      return
    }

    let current_line_elements = this.#hexagramElements[hex_priority_int].querySelectorAll('.line-frame')
    let line_element = null

    switch(line_arg_val) {
      case '0' :
        line_element = this.yinLine(line_index)
        break
      case '1' :
        line_element = this.yangLine(line_index)
        break
      default :
        console.log('View::addLine expects a string either 0 or 1 as argument 1')
    }
      // add either a yin line or yang line to either first or second hex element
    if (line_element) {
      line_element.style.opacity = 0;
      // hexagram lines are built upside-down according to DOM conventions,
      //  a new line renders above the most recent line, unless it's the first
      //  i.e with example arrays: domLines[0] === hexLines[hexLines.length-1] &&
      //    domLines[domLines.length-1] === hexLines[0]
      if (current_line_elements[0]) {
        this.#hexagramElements[hex_priority_int].insertBefore(
          line_element,
          current_line_elements[0]
        )
      } else {
        this.#hexagramElements[hex_priority_int].appendChild( line_element)
      }
      this.easeLines(current_line_elements,line_element)
    }
  }

  /**
  * Generate an entire hexagram and append it to the DOM
  * @param string hex_id - a numeric string or six characters consisiting of 1 and 0
  * @param integer hex_priority_int
  * @return void
  */
  addLines(hex_id,hex_priority_int) {
    if (typeof hex_id != 'string') {
      console.log('View::addLine expects a string as argument 1.')
      return
    }
    if (!/^[1|0]{6}$/.test(hex_id)) {
      console.log('View::addLine was passed an invalid hexagram ID as argument 1.')
      return
    }
    if (typeof hex_priority_int != 'number') {
      console.log('View::addLine expects an integer as argument 2.')
      return
    }
    if (!this.#hexagramElements[hex_priority_int]) {
      console.log('View::addLine was passed a hex priority index that is out of range.')
      return
    }
    // The hexagram is rendered upside-down; this first array item is the bottom element
    let line_element
    let dom_lines_arr = hex_id.split('').reverse()
    for (let i = 0; i < dom_lines_arr.length; i++) {
      switch(dom_lines_arr[i]) {
        case '0' :
          line_element = this.yinLine(i)
          break
        case '1' :
          line_element = this.yangLine(i)
          break
        default :
          line_element = null
      }
      if (line_element) {
        line_element.style.opacity = 0
        this.#hexagramElements[hex_priority_int].appendChild(line_element)
        this.fadeIn(line_element)
      }
    }
  }

  /**
  * @param array hexagram_objs - [Hexagram,Hexagram]
  * @return void
  */
  showHexagramNames(hexagram_objs) {

    if (typeof Hexagram != 'function') {
      console.log('View::showHexagramNames could not locate a Hexagram class definition.')
      return
    }
    if (!Array.isArray(hexagram_objs)) {
      console.log('View::showHexagramNames expects an array an an argument.')
      return
    }

    if (hexagram_objs[0] instanceof Hexagram) {
      this.#firstHexName.setAttribute('aria-hidden','false')
      this.#firstHexName.innerText =
        hexagram_objs[0].character + ' | ' + hexagram_objs[0].name
      this.#firstHexName.style.opacity = 0
      this.fadeIn(this.#firstHexName)

      if (hexagram_objs[1] instanceof Hexagram) {
        this.#hexMoverIcon.setAttribute('aria-hidden','false')
        this.#secondHexName.setAttribute('aria-hidden','false')
        this.#secondHexName.innerText =
          hexagram_objs[1].character + ' | ' + hexagram_objs[1].name
        this.#secondHexName.style.opacity = 0
        this.fadeIn(this.#secondHexName)

        this.#hexMoverIcon.style.opacity = 0
        this.fadeIn(this.#hexMoverIcon)
      } else {
        console.log('View::showHexagramNames expects a Hexagram object in the first array element.')
      }
    } else {
      console.log('View::showHexagramNames expects a Hexagram object in the first array element.')
    }
  }

  /**
  * @param integer
  * @return DOM Element
  */
  yangLine(line_index) {
    const line = document.createElement('div')
    const wrapper = document.createElement('div')
    wrapper.className = "flex-row flex-center line-frame"
    line.className = "full-line"
    wrapper.setAttribute('aria-label','Yang line')
    wrapper.appendChild(line)

    wrapper.className += ' line-' + line_index.toString()

    return wrapper
  }

  /**
  * @param integer
  * @return DOM Element
  */
  yinLine(line_index) {
    const line_1 = document.createElement('div')
    const line_2 = document.createElement('div')
    const wrapper = document.createElement('div')
    const subwrapper = document.createElement('div')
    wrapper.className = "flex-row flex-center line-frame"
    subwrapper.className = "half-line-frame flex-row flex-between"
    line_1.className = "half-line"
    line_2.className = "half-line"
    subwrapper.appendChild(line_1)
    subwrapper.appendChild(line_2)
    wrapper.setAttribute('aria-label','Yin line')
    wrapper.appendChild(subwrapper)

    wrapper.className += ' line-' + line_index.toString()

    return wrapper
  }

  /**
  * @param boolean
  * @return DOM Element
  */
  halfLine(arg) {
    const justify = (arg) ?  'flex-start' : 'flex-end'
    const line = document.createElement('div')
    const wrapper = document.createElement('div')
    const subwrapper = document.createElement('div')
    subwrapper.className = "half-line-frame flex-row"
    wrapper.className = "flex-row flex-center line-frame"
    line.className = "half-line"
    subwrapper.style.justifyContent = justify
    subwrapper.appendChild(line)
    wrapper.appendChild(subwrapper)
    return wrapper
  }

  /**
  * @return DOM Element
  */
  nullLine() {
    const line = this.yangLine(false)
    return line
  }

  /**
  * @return DOM Element
  */
  randomLine() {
    let line = {}
    let index = Math.floor(Math.random() * 4)
    let trans = Math.random()
    let arg = (Math.floor(Math.random() * 2) > 1) ? true : false;

    arg = (!index||index===4) ? true : arg
    trans = (trans >= 0.9) ? trans-0.1 : trans

    switch(index) {
      case 0 :
      case 4 :
        line = this.yangLine(arg)
        break
      case 1 :
        line = this.yinLine(arg)
        break
      case 2 :
      case 3 :
        line = this.halfLine(arg)
        break
      default :
    }
    line.style.opacity = trans
    return line
  }

  /**
  * @param DOMElement line_el
  * @return void
  */
  fadeIn(line_el) {
    let opacity = 0;
    let ease_line

    if (typeof line_el != 'object') {
      console.log('View::fadeIn expects a DOM element as an argument')
      return
    }
    ease_line = setInterval( function () {
      if (opacity >= 1) {
        clearInterval(ease_line)
      } else {
        opacity+=0.05
      }
      line_el.style.opacity = opacity
    },100)
  }

  /**
  * @param DOMElement line_el
  * @param DOMElement callback_line
  * @return void
  */
  pulseLine(line_el,callback_line) {
    const SELF = this
    let opacity = 1;
    let dir = true
    let ease_line

    if (typeof line_el != 'object') {
      console.log('View::pulseLine expects a DOM element as an argument')
      return
    }
    line_el.style.opacity = 1
    ease_line = setInterval( function () {
      if (!dir) {
        if (opacity >= 1) {
          clearInterval(ease_line)
        } else {
          opacity+=0.05
        }
      } else {
        opacity-=0.5
        if (opacity <= 0) {
          if (callback_line) {
            SELF.fadeIn(callback_line)
          }
          dir = false
        }
      }
      line_el.style.opacity = opacity
    },100)
  }

  /**
  * @param array current_line_elements - array of DOM Elements
  * @param DOMElement new_line_element
  * @return void
  */
  easeLines(current_line_elements,new_line_element) {
    if (current_line_elements.length) {
      for (let i = 0; i < current_line_elements.length; i++) {
        if (i===current_line_elements.length-1) {
          this.pulseLine(current_line_elements[i],new_line_element)
        } else {
          this.pulseLine(current_line_elements[i],null)
        }
      }
    } else {
      this.fadeIn(new_line_element)
    }
  }

  /**
  * Generates a random line in a random element on a variable grid
  */
  manifestLine() {
    const line_el = this.randomLine()
    let random_line_index = Math.floor(Math.random()*this.#flashFrameLines.length)
    let opacity = 0;
    let increment_direction = true
    let manifest_line = {}

    line_el.style.opacity = opacity

    while (this.#flashFrameLines[random_line_index].querySelector('.line-frame')) {
      random_line_index = Math.floor(Math.random()*this.#flashFrameLines.length)
    }

    this.#flashFrameLines[random_line_index].appendChild(line_el)

    manifest_line = setInterval( function () {

      if (!increment_direction ) {
        if (opacity <= 0) {

          clearInterval(manifest_line)

          if (line_el.parentElement) {
            line_el.parentElement.removeChild(line_el)
          }

        } else {
          opacity-=0.05
        }
      } else {
        opacity+=0.05
        if (opacity >= 0.5) { increment_direction = false }
      }
      line_el.style.opacity = opacity
    },50)
  }

  /**
  *  Visual animation for the line-throw event
  */
  flashPattern() {
    const SELF = this
    let grey_scale = 129
    let increment_direction = true
    let line_flash_count = 0
    let flash_button
    let manifest_line

    SELF.#flashFrame.className = 'show'
    SELF.#flashFrame.style.opacity = 1

    flash_button = setInterval( function () {

      grey_scale = SELF.setButtonRgb(grey_scale)

      if (!increment_direction) {
        if (grey_scale > 128) {
          grey_scale--
        } else {
          clearInterval(flash_button)
        }
      } else {
        grey_scale++
        if (grey_scale >= 250) {
          increment_direction = false
        }
      }
    },12)

    manifest_line = setInterval( function () {

      let backdrop_opacity = 1
      let ease_backdrop

      SELF.manifestLine()
      line_flash_count++

      if (line_flash_count > 20) {

        ease_backdrop = setInterval( function () {
          if (backdrop_opacity <= 0) {
            SELF.#flashFrame.className = 'hide'
            clearInterval(ease_backdrop)
          } else {
            backdrop_opacity-=0.05
          }
          SELF.#flashFrame.style.opacity = backdrop_opacity
        },50)

        clearInterval(manifest_line)
      }
    },100)
  }

  /**
  * Call reiteratively to grade the button color
  */
  setButtonRgb(n) {
    this.#lineButton.style.backgroundColor = 'rgb(' + n + ',' + n + ',' + n + ')'
    return n
  }
}
