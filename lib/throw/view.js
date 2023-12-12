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

  get lineButton() {
    return this.#lineButton
  }

  get firstHexNameButton() {
    return this.#firstHexName
  }

  get secondHexNameButton() {
    return this.#secondHexName
  }

  get refreshButton() {
    return this.#refreshButton
  }

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

  addLine(line_arg_val,hex_priority_int,line_index) {
    let current_line_elements = this.#hexagramElements[hex_priority_int].querySelectorAll('.line-frame')
    let line_element = {}
    let line_arg = null
    if (typeof line_arg_val === 'string') {
      line_arg = Number(line_arg_val)
    }
    if (typeof hex_priority_int === 'number' && this.#hexagramElements[hex_priority_int]) {
      switch(line_arg) {
        case 0 :
          line_element = this.yinLine(line_index)
          break
        case 1 :
          line_element = this.yangLine(line_index)
          break
        default :
          console.log('View::addLine expects an integer 0 or 1 as argument 1')
      }
      // add either a yin line or yang line to either first or second hex element
      if (line_element) {
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
      }
    } else {
      console.log('View::addLine expects an integer 0 or 1 as argument 2')
    }
  }

  showHexagramNames(hexagram_objs) {
    if (Array.isArray(hexagram_objs)) {
      if (typeof Hexagram === 'function') {
        if (hexagram_objs[0] instanceof Hexagram) {
          this.#firstHexName.innerText =
            hexagram_objs[0].character + ' | ' + hexagram_objs[0].name
          if (hexagram_objs[1] instanceof Hexagram) {
            this.#hexMoverIcon.setAttribute('aria-hidden','false')
            this.#firstHexName.setAttribute('aria-hidden','false')
            this.#secondHexName.setAttribute('aria-hidden','false')
            this.#secondHexName.innerText =
              hexagram_objs[1].character + ' | ' + hexagram_objs[1].name
          } else {
            console.log('View::showHexagramNames expects a Hexagram object in the first array element.')
          }
        } else {
          console.log('View::showHexagramNames expects a Hexagram object in the first array element.')
        }
      } else {
        console.log('View::showHexagramNames could not locate a Hexagram class definition.')
      }
    } else {
        console.log('View::showHexagramNames expects an array an an argument.')
    }


  }

  yangLine(line_index) {
    const line = document.createElement('div')
    const wrapper = document.createElement('div')
    wrapper.className = "flex-row flex-center line-frame"
    line.className = "full-line"
    wrapper.setAttribute('aria-label','Yang line')
    wrapper.appendChild(line)
    if (typeof line_index === 'number') {
      wrapper.className += ' line-' + line_index.toString()
    }
    return wrapper
  }

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
    if (typeof line_index === 'number') {
      wrapper.className += ' line-' + line_index.toString()
    }
    return wrapper
  }

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

  nullLine() {
    const line = this.yangLine(false)
    return line
  }

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

  manifestLine() {
    const SELF = this
    const line_el = this.randomLine()
    let opacity = 0;
    let increment_direction = true
    var manifest_line = {}
    var random_line_index = Math.floor(Math.random()*SELF.#flashFrameLines.length)

    line_el.style.opacity = opacity

    while (SELF.#flashFrameLines[random_line_index].querySelector('.line-frame')) {
      random_line_index = Math.floor(Math.random()*SELF.#flashFrameLines.length)
    }

    SELF.#flashFrameLines[random_line_index].appendChild(line_el)

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
        if (opacity >= 1) { increment_direction = false }
      }
      line_el.style.opacity = opacity
    },
    12
    )
  }

  flashLine() {
    const SELF = this
    var n = 129
    var dir = true
    var line_flash_count = 0
    SELF.#flashFrame.className = 'show'
    var flash = setInterval( function () {
      n = SELF.flashGreys(n)

      if (!dir) {
        if (n > 128) { n-- } else {
          clearInterval(flash)
          SELF.#flashFrame.className = 'hide'
        }
      } else {
        n++
        if (n > 250) { dir = false }
      }
      },
      12
    )
    var manifest = setInterval( function () {
      SELF.manifestLine()
      line_flash_count++
      if (line_flash_count > 40) {
        clearInterval(manifest)
      }
    },
    50
    )
  }

  flashGreys(n) {
    this.#lineButton.style.backgroundColor = 'rgb(' + n + ',' + n + ',' + n + ')'
    return n
  }
}
