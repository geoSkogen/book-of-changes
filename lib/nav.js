class Nav {

  #appElement = {}
  #openButton = {}
  #closeButton = {}

  #menuTabs = []
  #subMenus = []
  #menuItems = []

  constructor() {
    const SELF = this
    this.#appElement = document.getElementById('nav-modal')
    this.#openButton = document.getElementById('nav-hex')
    this.#closeButton = document.getElementById('close-nav-modal')

    this.#menuTabs = document.getElementsByClassName('nav-submenu-name-link')
    this.#subMenus = document.getElementsByClassName('nav-sublist')
    this.#menuItems = document.getElementsByClassName('subnav-link')

    this.#openButton.addEventListener('click', function (event) {
      SELF.show()
    })

    this.#openButton.addEventListener('keyup', function (event) {
      if (event.code==='Enter') {
        SELF.show()
      }
    })
    this.#closeButton.addEventListener('click', function (event) {
      SELF.hide()
    })

    this.#closeButton.addEventListener('keyup', function (event) {
      if (event.code==='Enter') {
        SELF.hide()
      }
    })

    this.#closeButton.addEventListener('keydown', function (event) {
      if (event.code==='Tab' && event.shiftKey) {
        SELF.hide()
      }
    })

    for (let i = 0; i < this.#menuTabs.length; i++) {

      this.#menuTabs[i].addEventListener( 'click', function (event) {
        SELF.toggleMenuTab(event.target)
      })

      this.#menuTabs[i].addEventListener('keydown', function (event) {
        let focus_el = null
        switch(event.code) {
          case 'Tab' :
            SELF.setMenuTab(event.target,false,false)
            if (!event.shiftKey) {
              if (event.target.id===SELF.#menuTabs[SELF.#menuTabs.length-1].id) {
                SELF.hideAllMenus()
                SELF.hide()
              }
            }
            break
          case 'Enter' :
            if (!JSON.parse(event.target.getAttribute('aria-expanded'))) {
              SELF.hideAllMenus()
              SELF.setMenuTab(event.target,true,true)
            }
            break
          case 'Escape' :
            SELF.hide()
            SELF.hideAllMenus()
            break
          case 'Space' :
            SELF.toggleMenuTab(event.target)
            break
          case 'ArrowUp' :
            SELF.hideAllMenus()
            SELF.setMenuTab(event.target,true,false)
            break
          case 'ArrowDown' :
            SELF.hideAllMenus()
            SELF.setMenuTab(event.target,true,true)
            break
          case 'ArrowLeft' :
            focus_el = SELF.getTraversedMenuTab(event.target,false)
            if (focus_el) {
              focus_el.focus()
            }
            break
          case 'ArrowRight' :
            focus_el = SELF.getTraversedMenuTab(event.target,true)
            if (focus_el) {
              focus_el.focus()
            }
            break
          default :
        }
      })
    }

    for (let i = 0; i < this.#menuItems.length; i++) {

      this.#menuItems[i].addEventListener('keydown', function (event) {
        let focus_el = null
        switch(event.code) {
          case 'Tab' :
            SELF.setMenuTab(SELF.getItemMenuTab(event.target),false,false)
            if (!event.shiftKey) {
              if (
                SELF.getItemMenuTab(event.target).id ===
                SELF.#menuTabs[SELF.#menuTabs.length-1].id
              )
              {
                SELF.hideAllMenus()
                SELF.hide()
              }
            }
            break;
          case 'Escape' :
          case 'Space' :
            if (!JSON.parse(event.target.getAttribute('aria-expanded'))) {
              let item_menu_tab = SELF.getItemMenuTab(event.target)
              if (item_menu_tab) {
                SELF.setMenuTab(item_menu_tab,false,false)
                item_menu_tab.focus()
              }
            }
            break
          case 'ArrowUp' :
            focus_el = SELF.getTraversedMenuItem(event.target,false)
            if (focus_el) {
              focus_el.focus()
            }
            break
          case 'ArrowDown' :
            focus_el = SELF.getTraversedMenuItem(event.target,true)
            if (focus_el) {
              focus_el.focus()
            }
            break
          case 'ArrowLeft' :
            focus_el = SELF.getTraversedMenuTab(event.target,false)
            if (focus_el) {
              SELF.setMenuTab(focus_el,true,false)
              SELF.setMenuTab(SELF.getItemMenuTab(event.target),false,false)
            }
            break
          case 'ArrowRight' :
            focus_el = SELF.getTraversedMenuTab(event.target,true)
            if (focus_el) {
              SELF.setMenuTab(focus_el,true,false)
              SELF.setMenuTab(SELF.getItemMenuTab(event.target),false,false)
            }
            break
          default :
        }
      })
    }

    document.body.addEventListener('keydown', function (event) {
      if (event.code==='Escape') {
        if (!JSON.parse(SELF.#appElement.getAttribute('aria-hidden'))) {
          SELF.#openButton.focus()
          SELF.hide()
        }
      }
    })
  }

  show() {
    this.#appElement.setAttribute('visually-hidden','false')
    this.#openButton.setAttribute('aria-expanded','true')
    document.getElementById('modal-backdrop').className = 'show'
  }

  hide() {
    this.hideAllMenus()
    this.#appElement.setAttribute('visually-hidden','true')
    this.#openButton.setAttribute('aria-expanded','false')
    document.getElementById('modal-backdrop').className = 'hide'
  }

  toggleMenuTab(menu_tab_obj) {
    if (typeof menu_tab_obj === 'object') {
      if (JSON.parse(menu_tab_obj.getAttribute('aria-expanded'))) {
        menu_tab_obj.setAttribute('aria-expanded','false')
        document.getElementById(
          menu_tab_obj.getAttribute('aria-controls')
        ).setAttribute('visually-hidden','true')
      } else {
        menu_tab_obj.setAttribute('aria-expanded','true')
        document.getElementById(
          menu_tab_obj.getAttribute('aria-controls')
        ).setAttribute('visually-hidden','false')

        for (let i = 0; i < this.#menuTabs.length; i++) {
          if (this.#menuTabs[i].id!=menu_tab_obj.id) {
            this.#menuTabs[i].setAttribute('aria-expanded','false')
            document.getElementById(
              this.#menuTabs[i].getAttribute('aria-controls')
            ).setAttribute('visually-hidden','true')
          }
        }
      }
    } else {
      console.log('Nav::toggleMenuTab expects a DOM object as an argument.')
    }
  }

  setMenuTab(menu_tab_obj,expanded_bool,focus_first_el_bool) {
    let focus_el = null
    menu_tab_obj.setAttribute('aria-expanded',expanded_bool)
    document.getElementById(
      menu_tab_obj.getAttribute('aria-controls')
    ).setAttribute('visually-hidden',!expanded_bool)
    if (expanded_bool) {
      focus_el = this.getMenuTabItem(menu_tab_obj,0)
      if (focus_el) {
        focus_el.focus()
      }
    }
  }

  getMenuTabItem(reference_el,list_index) {
    let result = null
    if (typeof reference_el === 'object') {
      if (reference_el.className.indexOf('nav-submenu-name-link') >= 0) {
        result = reference_el.nextElementSibling.querySelector('ul').querySelectorAll('li')[list_index] ?
          reference_el.nextElementSibling.querySelector('ul').querySelectorAll('li')[list_index].querySelector('a') : null
      } else {
        console.log('Nav::getMenuTabItem was passed an invalid element className: ' + reference_el.className)
      }
    } else {
      console.log('Nav::getMenuTabItem expects a DOM element as an argument')
    }
    return result
  }

  getItemMenuTab(reference_el) {
    let result = null
    if (typeof reference_el === 'object') {
      if (reference_el.className.indexOf('subnav-link') >= 0) {
        result = reference_el.parentElement.parentElement.parentElement.previousElementSibling
      } else {
        console.log('Nav::getItemMenuTab was passed an invalid element className: ' + reference_el.className)
      }
    } else {
      console.log('Nav::getItemMenuTab expects a DOM element as an argument')
    }
    return result
  }

  getTraversedMenuItem(reference_el,next_bool) {
    let result = null
    if (
      typeof reference_el === 'object' &&
      reference_el.className.indexOf('subnav-link') >= 0
    )
    {
      if (next_bool) {
        if (reference_el.parentElement.nextElementSibling) {
          result = reference_el.parentElement.nextElementSibling.querySelector('a')
        } else {
          result = reference_el.parentElement.parentElement.querySelector('li').querySelector('a')
        }
      } else {
        if (reference_el.parentElement.previousElementSibling) {
          result = reference_el.parentElement.previousElementSibling.querySelector('a')
        } else {
          result = reference_el.parentElement.parentElement.querySelector('a')
        }
      }
    } else {
      console.log('Nav::getTraversedMenuLink expects a DOM element of a.subnav-link')
    }
    return result
  }

  getTraversedMenuTab(target_el,next_bool) {
    let result = null
    let last_tab_index = undefined
    let reference_el = null
    if (typeof target_el === 'object') {
      if (target_el.className.indexOf('subnav-link')>=0) {
        // get the link's parent list-item's parent list's parent div's previous element link
        reference_el = target_el.parentElement.parentElement.parentElement.previousElementSibling
      } else {
        reference_el = target_el
      }
      if (reference_el.className.indexOf('nav-submenu-name-link') >= 0) {
        if (next_bool) {
          if (reference_el.parentElement.nextElementSibling) {
            result = reference_el.parentElement.nextElementSibling.querySelector('a')
          } else {
            result = reference_el.parentElement.parentElement.querySelectorAll('li').querySelector('a')
          }
        } else {
          if (reference_el.parentElement.previousElementSibling) {
            result = reference_el.parentElement.previousElementSibling.querySelector('a')
          } else {
            last_tab_index = this.#menuTabs.length-1
            result = reference_el.parentElement.parentElement.querySelectorAll('li')[last_tab_index].querySelector('a')
          }
        }
      } else {
        console.log('Nav::getTraversedMenuTab could not locate a valid reference element in class: ' + reference_el.className)
      }
    } else {
      console.log('Nav::getTraversedMenuTab expects a DOM element as an argument.')
    }
    return result
  }

  showVisibleFocus(menu_tab_obj) {
    if (typeof menu_tab_obj === 'object') {
      if (menu_tab_obj.className.indexOf('nav-submenu-name-link')>=0) {
        menu_tab_obj.className += ' focus-el'
      } else {
        console.log('Nav::showVisibleFocus expects a DOM object as an argument.')
      }
    } else {
      console.log('Nav::showVisibleFocus could not locate a valid menu tab element in class: ' + menu_tab_obj.className)
    }
  }

  hideVisibleFocus(menu_tab_obj) {
    if (typeof menu_tab_obj === 'object') {
      if (menu_tab_obj.className.indexOf('nav-submenu-name-link')>=0) {
        menu_tab_obj.className = menu_tab_obj.className.replace('focus-el','')
      } else {
        console.log('Nav::showVisibleFocus expects a DOM object as an argument.')
      }
    } else {
      console.log('Nav::showVisibleFocus could not locate a valid menu tab element in class: ' + menu_tab_obj.className)
    }
  }

  hideAllMenus() {
    for (let i = 0; i < this.#subMenus.length; i++) {
      this.#subMenus[i].setAttribute('visually-hidden','true')
      this.#menuTabs[i].setAttribute('aria-expanded','false')
    }
  }
}
