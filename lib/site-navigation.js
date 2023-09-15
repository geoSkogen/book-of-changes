(function () {

'use strict'

if (typeof Nav === 'function') {
  const NAV = new Nav()
} else {
  console.log("Site Navigator could not locate Nav class definition")
}

})()
