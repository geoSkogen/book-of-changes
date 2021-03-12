'use strict'

var wheel = document.querySelector('#wheel-outer')

wheel.addEventListener('click', function (event) {
  if (event.target.id.indexOf('outer')>-1) {
    console.log('clique')
    console.log(event.target.id)
  }
  event.stopPropagation()
})
