'use strict'

function toggleNextLevelMenu(top_level_menu_item) {
  const display_props = ['block','none'];
  let display_toggle = top_level_menu_item ? JSON.parse(top_level_menu_item.getAttribute('aria-expanded')) : null
  if (display_toggle) {
    display_props.reverse()
  }
  if (top_level_menu_item.nextElementSibling) {
    top_level_menu_item.nextElementSibling.style.display = display_props[0]
    top_level_menu_item.setAttribute('aria-expanded',JSON.stringify(!display_toggle))
  }
}

const TOP_LEVEL_MENU_ITEMS = document.querySelectorAll('.top-level-menu-item')
const SECONDARY_MENU_ITEMS = document.querySelectorAll('.secondary-menu-item')
const APP_STATE = { selection: null }


if (TOP_LEVEL_MENU_ITEMS) {
  TOP_LEVEL_MENU_ITEMS.forEach( (top_level_menu_item) => {

    top_level_menu_item.addEventListener('keyup', function (event) {
       if (event.code==='Enter'||event.code==='Space') {
         toggleNextLevelMenu(event.target)
       }
       if (JSON.parse(event.target.getAttribute('aria-expanded')) && event.code==='ArrowDown') {
         let secondary_menu_first_item = event.target.nextElementSibling.querySelector('.secondary-menu-item')
         if (secondary_menu_first_item) { secondary_menu_first_item.focus() }
       }
    })

    top_level_menu_item.addEventListener('keydown', function (event) {
      if (JSON.parse(event.target.getAttribute('aria-expanded')) && event.code==='Tab') {
        toggleNextLevelMenu(event.target)
      }
    })

    top_level_menu_item.addEventListener('click', function (event) {

      top_level_menu_item.parentElement.parentElement.querySelectorAll('.' + top_level_menu_item.className + '[aria-expanded="true"]').forEach( (expanded_top_level_menu_item) => {
        if (expanded_top_level_menu_item.id!=top_level_menu_item.id) {
          toggleNextLevelMenu(expanded_top_level_menu_item)
          console.log(expanded_top_level_menu_item)
        }
      })
      toggleNextLevelMenu(event.target)
    })
  })
}

if (SECONDARY_MENU_ITEMS) {
  SECONDARY_MENU_ITEMS.forEach( (secondary_menu_item) => {

    secondary_menu_item.addEventListener('keyup', function (event) {
      switch (event.code) {
        case 'ArrowDown' :
        case 'Down' :
          if (event.target.nextElementSibling) {
            event.target.nextElementSibling.focus()
          } else {
            event.target.parentElement.querySelector('.secondary-menu-item').focus()
          }
          break
        case 'ArrowUp' :
        case 'Up' :
          if (event.target.previousElementSibling) {
            event.target.previousElementSibling.focus()
          } else {
            let sibling_menu_items = event.target.parentElement.querySelectorAll('.secondary-menu-item')
            sibling_menu_items[sibling_menu_items.length-1].focus()
          }
          break
        case 'Enter' :
        case 'Space' :
          if (event.code==='Enter') {
            APP_STATE.selection = event.target.innerText
            console.log(APP_STATE)
          }
          toggleNextLevelMenu(event.target.parentElement.previousElementSibling)
          event.target.parentElement.previousElementSibling.focus()
          break
        case 'Home' :
          event.target.parentElement.querySelector('.secondary-menu-item').focus()
          break
        case 'End' :
          let sibling_menu_items = event.target.parentElement.querySelectorAll('.secondary-menu-item')
          sibling_menu_items[sibling_menu_items.length-1].focus()
          break
        default :
      }
    })

    secondary_menu_item.addEventListener('keydown', function (event) {
      if (event.code==='Tab') {
        toggleNextLevelMenu(event.target.parentElement.previousElementSibling)
      }
    })

    secondary_menu_item.addEventListener('click', function (event) {
      APP_STATE.selection = event.target.innerText
      console.log(APP_STATE)
      toggleNextLevelMenu(event.target.parentElement.previousElementSibling)
    })
  })
}
