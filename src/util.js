module.exports.find = function(id) {
  return Array.prototype.slice.call(document.querySelectorAll(id))
}
module.exports.get = function(id) {
  return document.querySelectorAll(id)[0]
}
module.exports.i18n = function(messages) {
  var lang = navigator.language.split('-')[0]
  module.exports.find('.tr').forEach(function(el) {
    var key = el.innerText.trim()
    if (messages[key]) {
      if (messages[key][lang]) {
        el.innerText = messages[key][lang]
      }
    }
  })
}
