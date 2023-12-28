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
    //this.#hexMoverIcon = document.getElementById('hex-mover')

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

  /**
  * @return HTML Collection
  */
  get lineButtons() {
    return this.#lineButtons
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
  * @param integer line_index_int
  * @param integer hex_index_int
  * @return void
  */
  toggleLine(line_index_int,hex_index_int) {

    if (typeof line_index_int != 'number' && typeof hex_index_int != 'number') {
      console.log('View::toggleLine expects integers as arguments 1 and 2.')
      return
    }

    const SELF = this
    let line_index = this.transformLineIndex(line_index_int,hex_index_int)
    let ease_line
    let pixel_width
    let line_elements

    if (!this.#lineButtons[line_index]) {
      console.log('View::toggleLine was passed a line index out of range.')
      return
    }

    switch(this.#lineButtons[line_index].getAttribute('aria-label')) {
      case 'yin' :
        pixel_width = 85
        line_elements = this.#lineButtons[line_index].querySelectorAll('.half-line')
        this.#lineButtons[line_index].setAttribute('disabled','true')
        ease_line = setInterval( function () {
          line_elements.forEach( (line_el) => {
            line_el.style.width = pixel_width.toString() + 'px'
          })
          if (pixel_width>=100) {

            SELF.#lineButtons[line_index].innerHTML = ''
            SELF.#lineButtons[line_index].appendChild( SELF.innerYangLine())
            SELF.#lineButtons[line_index].setAttribute('aria-label','yang')
            SELF.#lineButtons[line_index].removeAttribute('disabled')
            clearInterval(ease_line)
          }
          pixel_width+=1
        },20)
        break

      case 'yang' :
        this.#lineButtons[line_index].setAttribute('disabled','true')
        this.#lineButtons[line_index].innerHTML = ''
        this.#lineButtons[line_index].appendChild( this.innerYinLine(100))
        this.#lineButtons[line_index].setAttribute('aria-label','yin')

        pixel_width = 100
        line_elements = this.#lineButtons[line_index].querySelectorAll('.half-line')
        ease_line = setInterval( function () {
          line_elements.forEach( (line_el) => {
            line_el.style.width = pixel_width.toString() + 'px'
          })
          if (pixel_width<=85) {
            SELF.#lineButtons[line_index].removeAttribute('disabled')
            clearInterval(ease_line)
          }
          pixel_width-=1
        },20)
        break

        default :
    }
  }

  /**
  * @param integer line_index_int
  * @param integer hex_index_int
  * @return void
  */
  transformLineIndex(line_index_int,hex_index_int) {

    if (typeof line_index_int != 'number') {
      console.log('View::transformLineIndex expects an integer as argument 1.')
      return
    }
    if (line_index_int >= this.#lineButtons.length/2 || line_index_int < 0) {
      console.log('View::transformLineIndex expects an integer argument 1 within range of the button array.')
      return
    }

    let result = null
    let line_button_index = null

    line_button_index = ((this.#lineButtons.length/2)-1) - line_index_int
    result = hex_index_int ? line_button_index + (this.#lineButtons.length/2) : line_button_index

    return result
  }

  /**
  * @param string id_str
  * @return object - associative array
  */
  getLineFieldsById(id_str) {

    if (typeof id_str != 'string') {
      console.log('View::getLineFieldsById expects a string as an argument.')
      return null
    }

    let result = null
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
    return result
  }

  /**
  * @param integer initial_pixel_width - to override the stylesheet for start of animation
  * @return DOM Element
  */
  innerYinLine(initial_pixel_width) {
    const line_1 = document.createElement('div')
    const line_2 = document.createElement('div')
    const subwrapper = document.createElement('div')
    subwrapper.className = "half-line-frame button-line flex-row flex-between"
    line_1.className = "half-line"
    line_2.className = "half-line"
    if (initial_pixel_width) {
      line_1.style.width = initial_pixel_width.toString() + 'px'
      line_2.style.width = initial_pixel_width.toString() + 'px'
    }
    subwrapper.appendChild(line_1)
    subwrapper.appendChild(line_2)
    return subwrapper
  }

  /**
  * @return DOM Element
  */
  innerYangLine() {
    const line = document.createElement('div')
    line.className = "full-line button-line"
    return line
  }

  /**
  * @param Hexagram hexagram_obj
  * @param integer hexagram_index
  * @return void
  */
  showHexagramName(hexagram_obj,hexagram_index) {

    if (typeof Hexagram != 'function') {
      console.log('View::showHexagramNames could not locate a Hexagram class definition.')
      return
    }
    if (typeof hexagram_index != 'number') {
      console.log('View::showHexagramNames expects an integer as argument 2.')
      return
    }
    if (hexagram_index != 0 && hexagram_index !=1 ) {
      console.log('View::showHexagramNames expects an integer 0 or 1 as argument 2.')
      return
    }

    if (hexagram_obj instanceof Hexagram) {
      const SELF = this
      let hexagram_name_str =
        hexagram_obj.number.toString() + ' | ' + hexagram_obj.title['canonical']
      let ease_name
      let opacity = 1
      let fade_direction = true
      switch(hexagram_index) {
        case 0 :
          ease_name = setInterval( function () {
            SELF.#firstHexName.style.opacity = opacity
            SELF.#secondHexName.style.opacity = opacity
            //SELF.#hexMoverIcon.style.opacity = opacity

            if (opacity<=0.05 && fade_direction) {
              fade_direction = false
              SELF.#firstHexName.innerText = hexagram_name_str
            }

            if (!fade_direction && opacity>=1) {
              clearInterval(ease_name)
            }

            if (fade_direction) {
              opacity-=0.05
            } else {
              opacity+=0.05
            }

          },20)
          break
        case 1 :
          ease_name = setInterval( function () {
            SELF.#firstHexName.style.opacity = opacity
            SELF.#secondHexName.style.opacity = opacity
            //SELF.#hexMoverIcon.style.opacity = opacity

            if (opacity<=0.05 && fade_direction) {
              fade_direction = false
              SELF.#secondHexName.innerText = hexagram_name_str
            }

            if (!fade_direction && opacity>=1) {
              clearInterval(ease_name)
            }

            if (fade_direction) {
              opacity-=0.05
            } else {
              opacity+=0.05
            }

          },20)
          break
        default :
      }
      //this.#hexMoverIcon.setAttribute('aria-hidden','false')
    } else {
      console.log('View::showHexagramNames expects a Hexagram object as arugment 1.')
    }
  }

  /**
  * @param Trigram trigram
  * @param integer tri_index - for bottom (0) or top (1) 3 lines of the hexagram
  * @param integer hex_index
  */
  showTrigramName(trigram,tri_index,hex_index) {
    if (typeof Trigram != 'function') {
      console.log('View::showTrigams could not locate a Trigram class definiton.')
      return
    }
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
  }

  /**
  * Overwrite the HTML document test pattern with a custom configuration
  * @param array hexagrams_arr - an array of Hexagram objects
  */
  renderHexagrams(hexagrams_arr) {

    if (typeof Hexagram != 'function') {
      console.log('View::renderHexagrams could not locate a Hexagram class definition.')
      return
    }

    let valid_hex_ids_arr = []
    hexagrams_arr.forEach( (hexagram_obj) => {
      if (hexagram_obj instanceof Hexagram) {
        valid_hex_ids_arr.push(hexagram_obj.lines)
      } else {
        console.log('View:renderHexagrams expects an array of Hexagram objects as an argument.')
      }
    })
    for (let hex_priority_index = 0; hex_priority_index < valid_hex_ids_arr.length; hex_priority_index++) {

      for (let line_index = 0; line_index < valid_hex_ids_arr[hex_priority_index].length; line_index++) {

        let button_id = (line_index+1).toString() + '-' + (hex_priority_index+1).toString()
        let button = document.getElementById(button_id)
        let button_line = null

        if (button) {
          button_line = button.querySelector('.button-line')

          if (button_line) {
            button.removeChild(button_line)
          }

          switch(valid_hex_ids_arr[hex_priority_index][line_index]) {
            case '0' :
              button.appendChild(this.innerYinLine())
              button.setAttribute('aria-label','yin')
              break
            case '1' :
              button.appendChild(this.innerYangLine())
              button.setAttribute('aria-label','yang')
              break
            default :
              console.log('View::renderHexagrams found an invalid line argument.')
          }
        } else {
          console.log('View::renderHexagrams found an invalid line argument.')
        }
      }
    }
    return document.querySelectorAll('.button-line').length === this.#lineButtons.length ? true : false
  }
}
