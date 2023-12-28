(function () {

'use strict'

if (typeof Nav === 'function') {
  const NAV = new Nav(['hex-modal','filter-menu','filter-tooltip'])
} else {
  console.log("Site Navigator could not locate Nav class definition")
}

})()
