class Modal {

  #appElement = {}
  #modalBackdrop = {}

  #closeModalElement = {}
  #tabs = {}
  #tabContent = {}

  #number = {}
  #titles = []

  #generalPurports = {}
  #movingLines = {}

  #activeButtonId = null


  constructor() {
    const SELF = this
    this.#appElement = document.getElementById('hex-modal')
    this.#modalBackdrop = document.getElementById('modal-backdrop')

    this.#closeModalElement = document.getElementById('close-hex-modal')
    this.#tabs['inner'] = document.getElementById('tab-inner')
    this.#tabs['outer'] = document.getElementById('tab-outer')

    this.#tabContent['inner'] = document.getElementById('meta-col-inner')
    this.#tabContent['outer'] = document.getElementById('meta-col-outer')

    this.#number = document.getElementById('hex-number')
    this.#titles = document.getElementsByClassName('hex-title')

    this.#generalPurports['inner'] = document.getElementById('hex-meta-inner')
    this.#generalPurports['outer'] = document.getElementById('hex-meta-outer')

    this.#movingLines['inner'] = document.getElementById('moving-lines-inner')
    this.#movingLines['outer'] = document.getElementById('moving-lines-outer')

    this.#closeModalElement.addEventListener('click', function (event) {
      SELF.hide()
    })

    this.#closeModalElement.addEventListener('keyup', function (event) {
      if (event.code==='Enter') {
        SELF.hide()
      }
    })

    this.#tabs['inner'].addEventListener('click', function (event) {
      SELF.toggleTab('inner')
    })

    this.#tabs['inner'].addEventListener('keyup', function (event) {
      if (event.code==='Enter') {
        SELF.toggleTab('inner')
      }
    })

    this.#tabs['outer'].addEventListener('click', function (event) {
      SELF.toggleTab('outer')
    })

    this.#tabs['outer'].addEventListener('keyup', function (event) {
      if (event.code==='Enter') {
        SELF.toggleTab('outer')
      }
    })

    document.body.addEventListener('keydown', function (event) {
      if (event.code==='Escape') {
        if (!JSON.parse(SELF.#appElement.getAttribute('aria-hidden'))) {
          document.getElementById(SELF.#activeButtonId).focus()
          SELF.hide()
        }
      }
    })
  }


  get closeModalElement() {
    return this.#closeModalElement
  }


  get tabs() {
    return this.#tabs
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


  show(toggle_button_id) {

    if (typeof toggle_button_id != 'string') {
      console.log('Modal::show expects a string as an argument.')
      return
    }

    this.#appElement.setAttribute('aria-hidden','false')
    this.#appElement.style.opacity = 0
    this.#modalBackdrop.className = 'show'
    this.#tabs['inner'].focus()
    this.fadeIn()
    //document.getElementById('app').setAttribute('aria-hidden','true')

    if (document.getElementById(toggle_button_id)) {
      document.getElementById(toggle_button_id).setAttribute('aria-expanded','true')
      this.#activeButtonId = toggle_button_id
    }
  }


  hide() {
    this.fadeOut()
    if (this.#activeButtonId) {
      document.getElementById(this.#activeButtonId).setAttribute('aria-expanded','false')
      document.getElementById(this.#activeButtonId).focus()
      this.#activeButtonId = ''
    }

    //document.getElementById('app').setAttribute('aria-hidden','false')
  }


  showHexagram(hexagram_arg,toggle_button_id) {

    if (typeof Hexagram != 'function') {
      console.log('Modal::showHexagram could not locate the Hexagram class definition.')
      return
    }

    if (hexagram_arg instanceof Hexagram) {
      this.loadHexagram(hexagram_arg)
      this.show(toggle_button_id)
      this.toggleTab('inner')
    } else {
      console.log('Modal::showHexagram expects a Hexagram object as an argument.')
    }
  }


  toggleTab(line_set_val) {
    if (typeof line_set_val != 'string') {
      console.log('Modal::toggleTab expects a string as an argument.')
      return
    }

    if (!this.#tabs[line_set_val]) {
      console.log('Modal::toggleTab was passed an unrecognized line-set value.')
      return
    }

    this.#tabs[line_set_val].setAttribute('aria-selected','true')
    this.#tabContent[line_set_val].setAttribute('aria-hidden','false')
    if (this.#tabs[ this.toggleLineSetVal(line_set_val)]) {
      this.#tabs[ this.toggleLineSetVal(line_set_val)].setAttribute('aria-selected','false')
      this.#tabContent[ this.toggleLineSetVal(line_set_val)].setAttribute('aria-hidden','true')
    } else {
      console.log('Modal::toggleTab line-set value-toogle returned an unrecognized value.')
    }
  }


  toggleLineSetVal(line_set_str) {

    if (typeof line_set_str != 'string') {
      console.log('Modal::toggleLineSetVal expects a string as an argument')
      return ''
    }

    let result  = ''
    let return_vals = {
      'inner' : 'outer',
      'outer' : 'inner'
    }
    if (return_vals[line_set_str]) {
      result = return_vals[line_set_str]
    } else {
      console.log('Modal::toggleLineSetVal was passed an unrecognized line-set value.')
    }

    return result
  }


  loadHexagram(hexagram_obj) {

    if (typeof Hexagram != 'function') {
      console.log('Modal::showHexagram could not locate the Hexagram class definition.')
      return
    }

    if (hexagram_obj instanceof Hexagram) {
      const SELF = this
      // Title Sections
      this.#number.innerText = hexagram_obj.number

      for (let i = 0; i < this.#titles.length; i++) {

        let title_prop = (typeof this.#titles[i].id === 'string') ?
          this.#titles[i].id.replace('hex-title-','') : ''

        if (hexagram_obj.title[title_prop]) {
          this.#titles[i].innerText = hexagram_obj.title[title_prop]
        } else {
          console.log('View::loadHexagram did not find a Hexagram::title prop: ' + title_prop)
        }
      }
      // Interpretive Section
      ['inner','outer'].forEach( (line_set_str) => {

        SELF.addGeneralPurport(
          hexagram_obj.getGeneralPurport(line_set_str),
          line_set_str
        )

        if (hexagram_obj.isMoving) {
          SELF.addMovingLines(
            hexagram_obj.getMovingLinesPurports(line_set_str),
            line_set_str
          )
        } else {
          SELF.addStillLine(
            hexagram_obj.getStillLinesPurport(line_set_str),
            line_set_str
          )
        }
      })
    }
  }


  addGeneralPurport(text,line_set) {

    if (!this.#generalPurports[line_set]) {
      console.log('View::addGeneralPurport was passed a non-existent line-set value as argument 2.')
      return
    }
    if (typeof text != 'string') {
      console.log('View::addGeneralPurport expects a string as argument 1.')
    }

    this.#generalPurports[line_set].innerText = text
  }


  addStillLine(text,line_set) {

    if (!this.#movingLines[line_set]) {
      console.log('View::addStillLine was passed a non-existent line-set value as argument 2.')
      return
    }

    if (typeof text != 'string') {
      console.log('View::addStillLine expecsts a string as argument 1.')
    }

    this.#movingLines[line_set].innerText = text
  }


  addMovingLines(line_text_arr,line_set) {

    if (!Array.isArray(line_text_arr) || !line_text_arr.length) {
      console.log('View::addMovingLines expects an array 1.')
      return
    }

    if (!this.#movingLines[line_set]) {
      console.log('View::addMovingLines was passed a non-existent line-set value as argument 2.')
      return
    }

    let ul = document.createElement('ul')
    line_text_arr.forEach( (line_text) => {
      let line_el = this.getMovingLineItem(line_text,line_set)
      if (line_el) {
        ul.appendChild(line_el)
      } else {
        console.log('View::addMovingLines did not return a valid line element.')
      }
    })
    this.#movingLines[line_set].innerHTML = ''
    this.#movingLines[line_set].appendChild(ul)
  }


  getMovingLineItem(text,line_set) {

    if (typeof text != 'string') {
      console.log('View::getMovingLineItem expecsts a string as argument 1.')
      return null
    }

    if (!this.#movingLines[line_set]) {
      console.log('View::getMovingLineItem was passed a non-existent line-set value as argument 2.')
      return null
    }

    let li = document.createElement('li')
    li.className = 'moving-line-item'
    li.innerText = text

    return li
  }
}
