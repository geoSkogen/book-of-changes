class Nav {

  #appElement = {}
  #openButton = {}
  #closeButton = {}

  #menuTabs = []
  #subMenus = []

  constructor() {
    const SELF = this
    this.#appElement = document.getElementById('nav-modal')
    this.#openButton = document.getElementById('nav-hex')
    this.#closeButton = document.getElementById('close-nav-modal')

    this.#menuTabs = document.getElementsByClassName('nav-submenu-name-link')
    this.#subMenus = document.getElementsByClassName('subnav-modal')



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

    for (let i = 0; i < this.#menuTabs.length; i++) {
      this.#menuTabs[i].addEventListener( 'click', function (event) {
        console.log('tab click')
        SELF.toggleMenuTab(event.target)
      })

      this.#menuTabs[i].addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
          SELF.toggleMenuTab(event.target)
        }
      })
    }
  }

  show() {
    this.#appElement.setAttribute('visually-hidden','false')
    this.#openButton.setAttribute('aria-expanded','true')
  }

  hide() {
    this.#appElement.setAttribute('visually-hidden','true')
    this.#openButton.setAttribute('aria-expanded','false')
  }

  toggleMenuTab(menu_tab_obj) {
    if (typeof menu_tab_obj === 'object') {
      let expanded = !JSON.parse(menu_tab_obj.getAttribute('aria-expanded'))
      let hidden = !JSON.parse(
        document.getElementById(
          menu_tab_obj.getAttribute('aria-controls')
        ).parentElement.getAttribute('visually-hidden')
      )
      menu_tab_obj.setAttribute('aria-expanded',expanded)
      document.getElementById(
        menu_tab_obj.getAttribute('aria-controls')
      ).parentElement.setAttribute('visually-hidden',hidden)
    } else {
      console.log('Nav::toggleMenuTab expects a DOM object as an argument.')
    }
  }
}
