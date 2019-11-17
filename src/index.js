import {generate} from './pdf.js'
import {find, get} from './util.js'

function registerTabs(id) {
  function hideTabs(id) {
    find(id).forEach(function(el) {
      el.children[0].className = el.children[0].className.replace(" w3-border-red", "")
      get('#' + el.getAttribute('data-target')).style.display = 'none'
    })
  }
  hideTabs(id)
  var active = get(id)
  active.children[0].className += " w3-border-red"
  get('#' + active.getAttribute('data-target')).style.display = 'block'
  find(id).forEach(function(el) {
    el.onclick = function() {
      hideTabs(id)
      el.children[0].className += " w3-border-red"
      get('#' + el.getAttribute('data-target')).style.display = 'block'
    }
  })
}
window.onload = function() {
  registerTabs('.tab')

  get('#form_submit').onclick = function() {
    generate()
  }
}
