'use strict'

const StaticAccessControlStrategy = require('./StaticAccessControlStrategy')
const GRANT = StaticAccessControlStrategy.GRANT
const DENY = StaticAccessControlStrategy.DENY
const DEFAULT_SAMENESS_TESTER = require('./SamenessTester')

/**
 * An access control entry.
 */
class Ace {
  static granting ({ principal, securable, action, samenessTesterFn } = {}) {
    return Ace.of({ strategy: GRANT, principal, securable, action, samenessTesterFn })
  }

  static denying ({ principal, securable, action, samenessTesterFn } = {}) {
    return Ace.of({ strategy: DENY, principal, securable, action, samenessTesterFn })
  }

  static of ({ strategy, principal, securable, action, samenessTesterFn } = {}) {
    return new Ace({ strategy, principal, securable, action, samenessTesterFn })
  }

  constructor ({ strategy, principal, securable, action, samenessTesterFn = Ace.DEFAULT_SAMENESS_TESTER }) {
    this._principal = principal
    this._action = action
    this._securable = securable
    this._strategy = this._testSetStrategy(strategy)
    this._testSameness = samenessTesterFn

    Object.freeze(this)
  }

  get principal () {
    return this._principal
  }

  get action () {
    return this._action
  }

  get securable () {
    return this._securable
  }

  get strategy () {
    return this._strategy
  }

  _testSetStrategy (strategy) {
    if (typeof strategy?.grants !== 'function' || typeof strategy?.denies !== 'function') throw new Error('invalid strategy given')
    return strategy
  }

  /**
   * Determines if this Ace applies to the given principal, securable, and action.
   * @private
   */
  _applies ({ principal, securable, action }) {
    return (
      this.appliesToSecurable(securable) &&
      this.appliesToAction(action) &&
      (!this._principal || this._testSameness(this._principal, principal))
    )
  }

  grants ({ principal, action, securable, data } = {}) {
    return (
      this._applies({ principal, securable, action }) &&
      !this._strategy.denies({ principal, action, securable, data }) &&
      this._strategy.grants({ principal, action, securable, data })
    )
  }

  denies ({ principal, action, securable, data } = {}) {
    return (
      this._applies({ principal, securable, action }) &&
      this._strategy.denies({ principal, action, securable, data })
    )
  }

  appliesToPrincipal (principal) {
    return !this._principal || this._testSameness(principal, this._principal)
  }

  appliesToAction (action) {
    return !this._action || this._testSameness(action, this._action)
  }

  appliesToSecurable (securable) {
    return !this._securable || this._testSameness(securable, this._securable)
  }

  appliesToStrategy (strategy) {
    return this._testSameness(strategy, this._strategy)
  }
}

Ace.DEFAULT_SAMENESS_TESTER = DEFAULT_SAMENESS_TESTER

module.exports = Ace
