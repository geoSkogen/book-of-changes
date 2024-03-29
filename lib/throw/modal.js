class Modal {

  #appElement = {}
  #modalBackdrop = {}

  #closeModalElement = {}

  #shareButton = {}
  #shareableLink = {}
  #copyLinkButton = {}
  #tooltip = {}

  #shareRedditLink = {}
  #shareFacebookLink = {}

  #linkToBuilder = {}

  #tabs = {}
  #tabContent = {}

  #titleFocusElement = {}
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

    this.#shareButton = document.getElementById('hex-share')

    this.#shareableLink = document.getElementById('shareable-link')
    this.#copyLinkButton = document.getElementById('copy-button')
    this.#tooltip = document.getElementById('copied-tooltip')

    this.#shareFacebookLink = document.getElementById('share-facebook-link')
    this.#shareRedditLink = document.getElementById('share-reddit-link')

    this.#linkToBuilder = document.getElementById('link-to-builder')

    this.#tabs['inner'] = document.getElementById('tab-inner')
    this.#tabs['outer'] = document.getElementById('tab-outer')

    this.#tabContent['inner'] = document.getElementById('meta-col-inner')
    this.#tabContent['outer'] = document.getElementById('meta-col-outer')

    this.#titleFocusElement = document.getElementById('hex-title-focusable')
    this.#number = document.getElementById('hex-number')
    this.#titles = document.getElementsByClassName('hex-title')

    this.#generalPurports['inner'] = document.getElementById('hex-meta-inner')
    this.#generalPurports['outer'] = document.getElementById('hex-meta-outer')

    this.#movingLines['inner'] = document.getElementById('moving-lines-inner')
    this.#movingLines['outer'] = document.getElementById('moving-lines-outer')

    this.#closeModalElement.addEventListener('click', function (event) {
      SELF.hide(event)
    })

    this.#closeModalElement.addEventListener('keyup', function (event) {
      if (event.code==='Enter') {
        //SELF.hide()
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
          SELF.hide(event)
        }
      }
    })

    this.#shareButton.addEventListener('click', function (event) {
      SELF.toggleShareWidget()
    })

    this.#shareButton.addEventListener('keyup', function (event) {
      if (event.code==='Enter') {
        SELF.toggleShareWidget()
      }
    })

    this.#copyLinkButton.addEventListener('click', function (event) {
      SELF.copyLinkToClipboard()
      SELF.showTooltip('copied')
    })

    this.#copyLinkButton.addEventListener('keyup', function (event) {
      if (event.code==='Enter') {
        SELF.copyLinkToClipboard()
        SELF.showTooltip('copied')
      }
    })
  }

  /**
  * @return DOM Element
  */
  get closeModalElement() {
    return this.#closeModalElement
  }

  /**
  * @return HTML Collection
  */
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

  /**
  * @param string toggle_button_id
  */
  show(toggle_button_id) {

    if (typeof toggle_button_id != 'string') {
      console.log('Modal::show expects a string as an argument.')
      return
    }

    this.#appElement.setAttribute('aria-hidden','false')
    this.#appElement.style.opacity = 0
    this.#modalBackdrop.className = 'show'

    this.#titleFocusElement.focus()
    this.fadeIn()
    this.togglePageAccessibilityTree(true)

    if (document.getElementById(toggle_button_id)) {
      document.getElementById(toggle_button_id).setAttribute('aria-expanded','true')
      this.#activeButtonId = toggle_button_id
    }
  }

  /**
  * @param Event event - DOM event
  * @return void
  */
  hide(event) {
    this.fadeOut()
    if (this.#activeButtonId) {
      document.getElementById(this.#activeButtonId).setAttribute('aria-expanded','false')

      this.togglePageAccessibilityTree(false)
      // Bug fix against aria-expanded toggling back to true when the element receives focus
      event.stopPropagation()

      document.getElementById(this.#activeButtonId).focus()
      this.#activeButtonId = ''
    }
    //document.getElementById('app').setAttribute('aria-hidden','false')
  }

  /**
  * Ensure tab-able and readable elements outside the modal are deactivated until the modal is closed
  * @param boolean show_modal
  * @return void
  */
  togglePageAccessibilityTree(show_modal) {
    let tab_element_collections = []
    let tab_index_val = show_modal ? '-1' : '0'
    let region_hidden_val = show_modal ? 'true' : 'false'
    if (document.querySelector('#app')) {
      tab_element_collections.push(
        document.querySelector('#app').querySelectorAll('button')
      )
      tab_element_collections.push(
        document.querySelector('#app').querySelectorAll('a')
      )
      document.querySelector('#app').setAttribute('aria-hidden',region_hidden_val)
    }
    if (document.querySelector('footer')) {
      tab_element_collections.push(
        document.querySelector('footer').querySelectorAll('button')
      )
      tab_element_collections.push(
        document.querySelector('footer').querySelectorAll('a')
      )
      document.querySelector('footer').setAttribute('aria-hidden',region_hidden_val)
    }

    tab_element_collections.forEach( (tab_element_collection) => {
      tab_element_collection.forEach( (tab_element) => {
        tab_element.setAttribute('tabindex',tab_index_val)
      })
    })
  }

  toggleShareWidget() {
    let show_hide_shareable = document.getElementById(
      this.#shareButton.getAttribute('aria-controls')
    )
    let aria_hidden = undefined
    if (show_hide_shareable) {
      aria_hidden = JSON.parse(show_hide_shareable.getAttribute('aria-hidden'))
      show_hide_shareable.setAttribute('aria-hidden',!aria_hidden)
      this.#shareButton.setAttribute('aria-expanded',aria_hidden)
    }
  }

  /**
  * @param Hexagram hexagram_arg
  * @param string toggle_button_id
  * @return void
  */
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

  /**
  * @param string line_set_val
  * @return void
  */
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

  /**
  * @param string line_set_str
  * @return string
  */
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

  /**
  * @param Hexagram hexagram_obj
  * @return void
  */
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

      this.addShareableLink(hexagram_obj);
      this.addSocialShareParams(hexagram_obj);
      this.addLinkToBuilder(hexagram_obj);
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

  /**
  * @param string text
  * @param string line_set
  * @return void
  */
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

  /**
  * @param string text
  * @param string line_set
  * @return void
  */
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

  /**
  * @param array line_text_arr
  * @param string line_set
  * @return void
  */
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

  /**
  * @param string text
  * @param string line_set
  * @return string
  */
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

  /**
  * @param Hexagram hexagram_obj
  * @return void
  */
  addShareableLink(hexagram_obj) {
    this.#shareableLink.innerText = this.getShareableLink(hexagram_obj)
  }


  /**
  * @param Hexagram hexagram_obj
  * @return string
  */
  getShareableLink(hexagram_obj) {
    if (typeof Hexagram != 'function') {
      console.log('Modal::getShareableLink could not locate the Hexagram class definition.')
      return ''
    }

    if (hexagram_obj instanceof Hexagram) {
      let moving_lines_string = ''
      let query_string = '?id=' + hexagram_obj.number.toString()
      if (hexagram_obj.isMoving) {
        hexagram_obj.movingLines.forEach( (moving_line) => {
          moving_lines_string += (moving_line+1).toString()
        })
        query_string += '&moving_lines=' + moving_lines_string
      }
      return window.location.origin + window.location.pathname + query_string
    } else {
      console.log('Modal::getShareableLink expects a Hexagram object as an argument.')
      return ''
    }
  }

  /**
  * @param Hexagram hexagram_obj
  * @return void
  */
  addSocialShareParams(hexagram_obj) {
    if (typeof Hexagram != 'function') {
      console.log('Modal::addSocialShareParams could not locate the Hexagram class definition.')
      return
    }

    if (hexagram_obj instanceof Hexagram) {
      this.#shareFacebookLink.href = this.#shareFacebookLink.href.split('?')[0] +
        '?u=' + encodeURI(this.getShareableLink(hexagram_obj)) + '&src=sdkpreparse'

      this.#shareRedditLink.href = this.#shareRedditLink.href.split('?')[0] +
        '?url=' + encodeURI(this.getShareableLink(hexagram_obj)) + '&title=' +
        hexagram_obj.title.original + ' | ' + hexagram_obj.title.canonical
    } else {
      console.log('Modal::addSocialShareParams expects a Hexagram object as an argument.')
    }
  }

  addLinkToBuilder(hexagram_obj) {
    let share_link_query = this.getShareableLink(hexagram_obj).split('?')[1]
    this.#linkToBuilder.href = 'build/?' + share_link_query
  }

  copyLinkToClipboard() {
    navigator.clipboard.writeText(this.#shareableLink.textContent)
  }

  showTooltip(text_content_str) {
    const SELF = this
    let opacity = 0
    let direction = true
    let flash
    this.#tooltip.setAttribute('aria-hidden','false')
    this.#tooltip.style.opacity = 0
    this.#tooltip.innerText = text_content_str
    flash = setInterval( function () {
      if (!direction) {
        if (opacity <= 0) {
          SELF.#tooltip.setAttribute('aria-hidden','true')
          SELF.#tooltip.style.opacity = 0
          clearInterval(flash)
          return
        } else {
          opacity -= 0.025
        }
      } else {
        opacity += 0.05
        if (opacity >= 1) {
          direction = false
        }
      }
      SELF.#tooltip.style.opacity = opacity
    },30)
  }
}
