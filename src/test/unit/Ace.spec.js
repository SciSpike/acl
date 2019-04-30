/* global describe,it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const uuid = require('uuid/v4')
const { traits } = require('mutrait')

const Ace = require('../../main/Ace')
const StaticAccessControlStrategy = require('../../main/StaticAccessControlStrategy')
const GRANT = StaticAccessControlStrategy.GRANT
const DENY = StaticAccessControlStrategy.DENY

const Identifiable = require('./Identifiable')

class Principal extends traits(Identifiable) {
  constructor (id) {
    super(...arguments)
    this._id = id
  }
}

describe('Ace', () => {
  it('should work with grant', function () {
    const principal = new Principal()
    const action = uuid()

    const ace = Ace.granting({ principal, action })

    expect(ace.grants({ principal, action })).to.equal(true)
    expect(ace.grants({ principal, action: uuid() })).to.equal(false)
    expect(ace.denies({ principal, action })).to.equal(false)
    expect(ace.denies({ principal, action: uuid() })).to.equal(false)
    expect(ace.appliesToPrincipal(principal)).to.equal(true)
    expect(ace.appliesToAction(action)).to.equal(true)
    expect(ace.appliesToSecurable()).to.equal(true)
    expect(ace.appliesToStrategy(GRANT)).to.equal(true)
  })

  it('should work with deny', function () {
    const principal = new Principal()
    const action = uuid()

    const ace = Ace.denying({ principal, action })

    expect(ace.denies({ principal, action })).to.equal(true)
    expect(ace.denies({ principal, action: uuid() })).to.equal(false)
    expect(ace.grants({ principal, action })).to.equal(false)
    expect(ace.grants({ principal, action: uuid() })).to.equal(false)
    expect(ace.appliesToPrincipal(principal)).to.equal(true)
    expect(ace.appliesToAction(action)).to.equal(true)
    expect(ace.appliesToSecurable()).to.equal(true)
    expect(ace.appliesToStrategy(DENY)).to.equal(true)
  })

  it('should work with a custom strategy', function () {
    const sally = 'sally'
    const john = 'john'
    const felix = 'felix'
    const jan = 'jan'

    const close = 'close'

    const strategy = {
      grants: ({ principal, action, securable, data }) => {
        switch (action) {
          case close:
            switch (principal) {
              case sally: return true
              case john: return securable.balance < data.hiThreshold
              default: return securable.balance < data.loThreshold
            }
        }
      },
      denies: ({ principal, action }) => {
        switch (action) {
          case close:
            switch (principal) {
              case felix: return true
              default: return false
            }
        }
      }
    }

    const hiThreshold = 10000
    const loThreshold = 100
    const data = { hiThreshold, loThreshold }

    const hiAccount = { balance: hiThreshold + 1 }
    const mdAccount = { balance: hiThreshold - 1 }
    const loAccount = { balance: loThreshold - 1 }

    const hi = Ace.of({ securable: hiAccount, strategy })
    const md = Ace.of({ securable: mdAccount, strategy })
    const lo = Ace.of({ securable: loAccount, strategy })

    for (const ace of [hi, md, lo]) {
      expect(ace.appliesToPrincipal()).to.equal(true)
      expect(ace.appliesToPrincipal(sally)).to.equal(true)
      expect(ace.appliesToPrincipal(john)).to.equal(true)
      expect(ace.appliesToPrincipal(felix)).to.equal(true)
      expect(ace.appliesToPrincipal(jan)).to.equal(true)

      expect(ace.appliesToAction()).to.equal(true)
      expect(ace.appliesToAction(close)).to.equal(true)

      expect(ace.appliesToStrategy()).to.equal(false)
      expect(ace.appliesToStrategy(strategy)).to.equal(true)
    }

    expect(hi.appliesToSecurable(hiAccount)).to.equal(true)
    expect(md.appliesToSecurable(mdAccount)).to.equal(true)
    expect(lo.appliesToSecurable(loAccount)).to.equal(true)

    expect(hi.grants({ principal: sally, action: close, securable: hiAccount, data })).to.equal(true)
    expect(hi.denies({ principal: sally, action: close, securable: hiAccount, data })).to.equal(false)
    expect(md.grants({ principal: sally, action: close, securable: mdAccount, data })).to.equal(true)
    expect(md.denies({ principal: sally, action: close, securable: mdAccount, data })).to.equal(false)
    expect(lo.grants({ principal: sally, action: close, securable: loAccount, data })).to.equal(true)
    expect(lo.denies({ principal: sally, action: close, securable: loAccount, data })).to.equal(false)

    expect(hi.grants({ principal: john, action: close, securable: hiAccount, data })).to.equal(false)
    expect(hi.denies({ principal: john, action: close, securable: hiAccount, data })).to.equal(false)
    expect(md.grants({ principal: john, action: close, securable: mdAccount, data })).to.equal(true)
    expect(md.denies({ principal: john, action: close, securable: mdAccount, data })).to.equal(false)
    expect(lo.grants({ principal: john, action: close, securable: loAccount, data })).to.equal(true)
    expect(lo.denies({ principal: john, action: close, securable: loAccount, data })).to.equal(false)

    expect(hi.grants({ principal: felix, action: close, securable: hiAccount, data })).to.equal(false)
    expect(hi.denies({ principal: felix, action: close, securable: hiAccount, data })).to.equal(true)
    expect(md.grants({ principal: felix, action: close, securable: mdAccount, data })).to.equal(false)
    expect(md.denies({ principal: felix, action: close, securable: mdAccount, data })).to.equal(true)
    expect(lo.grants({ principal: felix, action: close, securable: loAccount, data })).to.equal(false)
    expect(lo.denies({ principal: felix, action: close, securable: loAccount, data })).to.equal(true)

    expect(hi.grants({ principal: jan, action: close, securable: hiAccount, data })).to.equal(false)
    expect(hi.denies({ principal: jan, action: close, securable: hiAccount, data })).to.equal(false)
    expect(md.grants({ principal: jan, action: close, securable: mdAccount, data })).to.equal(false)
    expect(md.denies({ principal: jan, action: close, securable: mdAccount, data })).to.equal(false)
    expect(lo.grants({ principal: jan, action: close, securable: loAccount, data })).to.equal(true)
    expect(lo.denies({ principal: jan, action: close, securable: loAccount, data })).to.equal(false)
  })
})
