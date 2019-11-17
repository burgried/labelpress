module.exports.find = function(id) {
  return Array.prototype.slice.call(document.querySelectorAll(id))
}

module.exports.get = function(id) {
  return document.querySelectorAll(id)[0]
}
