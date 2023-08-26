class View {

  #hexagramElements
  #lineButton

  constructor() {
    this.#hexagramElements = [
      document.getElementById('wheel-inner'),
      document.getElementById('second-hex')
    ]
    this.#lineButton = document.getElementById('wheel-outer')
  }

  get lineButton() {
    return this.#lineButton
  }

  addLine(line_arg_val,hex_priority_int) {
    let line_element = {}
    let line_arg = null
    if (typeof line_arg_val === 'string') {
      line_arg = Number(line_arg_val)
      console.log('View::addLine recast argument 1 as an integer')
    }
    if (typeof hex_priority_int === 'number' && this.#hexagramElements[hex_priority_int]) {
      switch(line_arg) {
        case 0 :
          line_element = this.yinLine(true)
          break
        case 1 :
          line_element = this.yangLine(true)
          break
        default :
          console.log('View::addLine expects an integer 0 or 1 as argument 1')
      }
      // add either a yin line or yang line to either first or second hex element
      if (line_element) {
        this.#hexagramElements[hex_priority_int].appendChild( line_element)
      }

    } else {
      console.log('View::addLine expects an integer 0 or 1 as argument 2')
    }
  }

  addHexagram(line_conifg_arr,hex_priority_int) {

  }

  updateLine(line_id_str,line_arg_val,hex_priority_int) {

  }

  yangLine(arg) {
    const line = document.createElement('div')
    const wrapper = document.createElement('div')
    wrapper.className = "flex-row flex-center line-frame"
    line.className = "full-line"
    if (!arg) {
      line.style.backgroundColor = 'black'
    }
    wrapper.appendChild(line)
    return wrapper
  }

  yinLine(arg) {
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
    wrapper.appendChild(subwrapper)
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
}
