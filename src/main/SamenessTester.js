'use strict'

module.exports = function testSameness (that, other) {
  return that === other ||
    (that?._id && that?._id === other?._id) ||
    (that?.id && that?.id === other?.id) ||
    ((typeof that?.identifies === 'function') && that?.identifies(other))
}
