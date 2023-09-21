class Modal {

  #appElement = {}

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

  }

  get closeModalElement() {
    return this.#closeModalElement
  }

  get tabs() {
    return this.#tabs
  }

  show(toggle_button_id) {
    this.#appElement.setAttribute('aria-hidden','false')
    if (typeof toggle_button_id === 'string') {
      if (document.getElementById(toggle_button_id)) {
        document.getElementById(toggle_button_id).setAttribute('aria-expanded','true')
        document.getElementById('modal-backdrop').className = 'show'
        this.#activeButtonId = toggle_button_id
      }
    } else {
      console.log('Modal::show expects a string as argument 1.')
    }
  }

  hide() {
    this.#appElement.setAttribute('aria-hidden','true')
    if (this.#activeButtonId) {
      document.getElementById(this.#activeButtonId).setAttribute('aria-expanded','false')
      document.getElementById('modal-backdrop').className = 'hide'
    }
  }

  showHexagram(hexagram_arg,toggle_button_id) {
    if (typeof Hexagram === 'function') {
      if (hexagram_arg instanceof Hexagram) {
        this.loadHexagram(hexagram_arg)
        this.show(toggle_button_id)
        this.toggleTab('inner')
      } else {
        console.log('Modal::showHexagram expects a Hexagram object as an argument.')
      }
    } else {
      console.log('Modal::showHexagram could not locate the Hexagram class definition.')
    }

  }

  toggleTab(line_set_val) {
    if (typeof line_set_val === 'string') {
      if (this.#tabs[line_set_val]) {
        this.#tabs[line_set_val].setAttribute('aria-selected','true')
        this.#tabContent[line_set_val].setAttribute('aria-hidden','false')
        if (this.#tabs[ this.toggleLineSetVal(line_set_val)]) {
          this.#tabs[ this.toggleLineSetVal(line_set_val)].setAttribute('aria-selected','false')
          this.#tabContent[ this.toggleLineSetVal(line_set_val)].setAttribute('aria-hidden','true')
        } else {
          console.log('Modal::toggleTab line-set value-toogle returned an unrecognized value.')
        }
      } else {
        console.log('Modal::toggleTab was passed an unrecognized line-set value.')
      }
    } else {
      console.log('Modal::toggleTab expects a string as an argument.')
    }
  }

  toggleLineSetVal(line_set_str) {
    let result  = ''
    if (typeof line_set_str === 'string') {
      let return_vals = {
        'inner' : 'outer',
        'outer' : 'inner'
      }
      if (return_vals[line_set_str]) {
        result = return_vals[line_set_str]
      } else {
        console.log('Modal::toggleLineSetVal was passed an unrecognized line-set value.')
      }
    } else {
      console.log('Modal::toggleLineSetVal expects a string as an argument')
    }
    return result
  }

  loadHexagram(hexagram_obj) {
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

  addGeneralPurport(text,line_set) {
    if (this.#generalPurports[line_set]) {
      if (typeof text === 'string') {
        this.#generalPurports[line_set].innerText = text
      } else {
        console.log('View::addGeneralPurport expecsts a string as argument 1.')
      }
    } else {
      console.log('View::addGeneralPurport was passed a non-existent line-set value as argument 2.')
    }
  }

  addStillLine(text,line_set) {
    if (this.#movingLines[line_set]) {
      if (typeof text === 'string') {
        this.#movingLines[line_set].innerText = text
      } else {
        console.log('View::addStillLine expecsts a string as argument 1.')
      }
    } else {
      console.log('View::addStillLine was passed a non-existent line-set value as argument 2.')
    }
  }

  addMovingLines(line_text_arr,line_set) {
    if (Array.isArray(line_text_arr) && line_text_arr.length) {
      let ul = document.createElement('ul')
      line_text_arr.forEach( (line_text) => {
        let line_el = this.getMovingLineItem(line_text,line_set)
        if (line_el) {
          ul.appendChild(line_el)
        } else {
          console.log('View::addMovingLines did not return a valid line element.')
        }
      })
      if (this.#movingLines[line_set]) {
        this.#movingLines[line_set].appendChild(ul)
      } else {
        console.log('View::addMovingLines was passed a non-existent line-set value as argument 2.')
      }
    } else {
      console.log('View::addMovingLines expects an array of strings an argument 1.')
    }
  }

  getMovingLineItem(text,line_set) {
    let result = null
    if (this.#movingLines[line_set]) {
      if (typeof text === 'string') {
        let li = document.createElement('li')
        li.className = 'moving-line-item'
        li.innerText = text
        result = li
      } else {
          console.log('View::getMovingLineItem expecsts a string as argument 1.')
      }
    } else {
        console.log('View::getMovingLineItem was passed a non-existent line-set value as argument 2.')
    }
    return result
  }
}
