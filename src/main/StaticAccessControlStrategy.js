'use strict'

const { Enum } = require('enumify')

class StaticAccessControlStrategy extends Enum {
  grants () {
    return this === StaticAccessControlStrategy.GRANT
  }

  denies () {
    return this === StaticAccessControlStrategy.DENY
  }
}

StaticAccessControlStrategy.initEnum(['GRANT', 'DENY'])

module.exports = StaticAccessControlStrategy
