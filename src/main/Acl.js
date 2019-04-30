'use strict'

const { GRANT, DENY } = require('./StaticAccessControlStrategy')
const Ace = require('./Ace')

/**
 * Access control list
 */
class Acl {
  constructor () {
    this._aces = []
  }

  /**
   * Returns `true` if all of the given actions are granted among the given principals against the given securable, as long as none of the principals are denied the ability to take any of the actions.
   * @param principals
   * @param actions
   * @param securable
   * @param data
   * @return {boolean}
   */
  grants ({ principals, actions, securable, data }) {
    principals = this._ensureArray(principals)
    actions = this._ensureArray(actions)

    const aces = this._findApplicableAces({ principals, actions, securable })
    if (this._denies({ principals, actions, securable, aces })) return false

    const grantsByAction = actions.reduce((grants, action) => {
      grants[action] = false
      return grants
    }, {})

    for (const ace of aces) {
      for (const principal of principals) {
        for (const action of actions) {
          if (!grantsByAction[action] && ace.grants({ principal, action, securable, data })) {
            grantsByAction[action] = true
          }
        }
      }
    }

    return !actions
      .map(action => grantsByAction[action])
      .includes(false)
  }

  /**
   * Returns `true` if any of the given principals are explicitly denied taking any of the given actions against the given securable, else returns `false`.
   * @param principals
   * @param actions
   * @param securable
   * @param data
   * @return {boolean}
   */
  denies ({ principals, actions, securable, data }) {
    principals = this._ensureArray(principals)
    actions = this._ensureArray(actions)

    return this._denies({
      principals,
      actions,
      securable,
      data,
      aces: this._findApplicableAces({ principals, actions, securable })
    })
  }

  _denies ({ principals, actions, securable, data, aces }) {
    principals = this._ensureArray(principals)
    actions = this._ensureArray(actions)

    for (const ace of aces) {
      for (const principal of principals) {
        for (const action of actions) {
          if (ace.denies({ principal, action, securable, data })) return true
        }
      }
    }
    return false
  }

  _findApplicableAces ({ principals, actions, securable }) {
    return this._aces.filter(ace => {
      let applies = false
      for (const p of principals) {
        if (ace.appliesToPrincipal(p)) {
          applies = true
          break
        }
      }
      if (!applies) return false

      applies = false
      for (const a of actions) {
        if (ace.appliesToAction(a)) {
          applies = true
          break
        }
      }
      if (!applies) return false

      return ace.appliesToSecurable(securable)
    })
  }

  _ensureArray (it) {
    return Array.isArray(it) ? it : [it]
  }

  grant ({ principal, securable, action }) {
    return this.secure({ strategy: GRANT, principal, securable, action })
  }

  ungrant ({ principal, securable, action }) {
    return this.unsecure({ strategy: GRANT, principal, securable, action })
  }

  deny ({ principal, securable, action }) {
    return this.secure({ strategy: DENY, principal, securable, action })
  }

  undeny ({ principal, securable, action }) {
    return this.unsecure({ strategy: DENY, principal, securable, action })
  }

  secure ({ strategy, principal, securable, action }) {
    return this._secure({ strategy, principal, securable, action, add: true })
  }

  unsecure ({ strategy, principal, securable, action }) {
    return this._secure({ strategy, principal, securable, action, add: false })
  }

  _secure ({ strategy, principal, securable, action, add = true }) {
    const index = this._aces.findIndex(ace =>
      ace.appliesToPrincipal(principal) &&
      ace.appliesToAction(action) &&
      ace.appliesToStrategy(strategy) &&
      (securable ? ace.appliesToSecurable(securable) : true)
    )

    if (add && index === -1) { // not found, so add
      this._aces.push(Ace.of({ strategy, principal, securable, action }))
    } else if (!add && index !== -1) { // found, so remove
      this._aces.splice(index, 1)
    }

    return this
  }
}

module.exports = Acl
