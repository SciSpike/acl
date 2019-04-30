'use strict'

const { Enum } = require('enumify')

class PrimitiveAction extends Enum {
  static staticActions () {
    return [PrimitiveAction.CREATE, PrimitiveAction.REFERENCE]
  }

  static instanceActions () {
    return [PrimitiveAction.READ, PrimitiveAction.UPDATE, PrimitiveAction.DELETE, PrimitiveAction.SECURE]
  }
}

PrimitiveAction.initEnum(['CREATE', 'REFERENCE', 'READ', 'UPDATE', 'DELETE', 'SECURE'])

module.exports = PrimitiveAction
