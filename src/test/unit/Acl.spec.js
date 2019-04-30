/* global describe,it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const uuid = require('uuid/v4')

const Acl = require('../../main/Acl')

describe('Acl', () => {
  it('should work with single principal, action & securable', function () {
    const acl = new Acl()
    const principal = uuid()
    const securable = uuid()
    const action = uuid()

    acl.grant({ principal, securable, action })

    expect(acl.grants({ principals: principal, actions: action, securable })).to.equal(true)
    expect(acl.denies({ principals: principal, actions: action, securable })).to.equal(false)

    acl.ungrant({ principal, securable, action })

    expect(acl.grants({ principals: principal, actions: action, securable })).to.equal(false)
    expect(acl.denies({ principals: principal, actions: action, securable })).to.equal(false)

    acl.deny({ principal, securable, action })

    expect(acl.grants({ principals: principal, actions: action, securable })).to.equal(false)
    expect(acl.denies({ principals: principal, actions: action, securable })).to.equal(true)

    acl.undeny({ principal, securable, action })

    expect(acl.grants({ principals: principal, actions: action, securable })).to.equal(false)
    expect(acl.denies({ principals: principal, actions: action, securable })).to.equal(false)
  })

  it('should work with single principal, action & no securable', function () {
    const acl = new Acl()
    const principal = uuid()
    const action = uuid()

    acl.grant({ principal, action })

    expect(acl.grants({ principals: principal, actions: action })).to.equal(true)
    expect(acl.denies({ principals: principal, actions: action })).to.equal(false)
  })

  it('should work with multiple principals, actions & a securable', function () {
    const acl = new Acl()
    const principals = [uuid(), uuid()]
    const securable = uuid()
    const actions = [uuid(), uuid()]

    acl.grant({ principal: principals[0], securable, action: actions[0] })
    acl.grant({ principal: principals[1], securable, action: actions[1] })

    expect(acl.grants({ principals: principals[0], actions: actions[0], securable })).to.equal(true)
    expect(acl.grants({ principals: principals[1], actions: actions[1], securable })).to.equal(true)
    expect(acl.grants({ principals, actions, securable })).to.equal(true)
    expect(acl.denies({ principals, actions, securable })).to.equal(false)

    acl.ungrant({ principal: principals[1], securable, action: actions[1] })

    expect(acl.grants({ principals: principals[0], actions: actions[0], securable })).to.equal(true)
    expect(acl.grants({ principals: principals[1], actions: actions[1], securable })).to.equal(false)
    expect(acl.grants({ principals, actions, securable })).to.equal(false)
    expect(acl.denies({ principals, actions, securable })).to.equal(false)

    acl.ungrant({ principal: principals[0], securable, action: actions[0] })

    expect(acl.grants({ principals: principals[0], actions: actions[0], securable })).to.equal(false)
    expect(acl.grants({ principals: principals[1], actions: actions[1], securable })).to.equal(false)
    expect(acl.grants({ principals, actions, securable })).to.equal(false)
    expect(acl.denies({ principals, actions, securable })).to.equal(false)

    acl.deny({ principal: principals[0], securable, action: actions[0] })
    acl.deny({ principal: principals[1], securable, action: actions[1] })

    expect(acl.grants({ principals: principals[0], actions: actions[0], securable })).to.equal(false)
    expect(acl.grants({ principals: principals[1], actions: actions[1], securable })).to.equal(false)
    expect(acl.grants({ principals, actions, securable })).to.equal(false)
    expect(acl.denies({ principals, actions, securable })).to.equal(true)

    acl.undeny({ principal: principals[0], securable, action: actions[0] })
    acl.undeny({ principal: principals[1], securable, action: actions[1] })

    expect(acl.grants({ principals: principals[0], actions: actions[0], securable })).to.equal(false)
    expect(acl.grants({ principals: principals[1], actions: actions[1], securable })).to.equal(false)
    expect(acl.grants({ principals, actions, securable })).to.equal(false)
    expect(acl.denies({ principals, actions, securable })).to.equal(false)

    acl.grant({ principal: principals[0], securable, action: actions[0] })
    acl.grant({ principal: principals[1], securable, action: actions[1] })

    expect(acl.grants({ principals: principals[0], actions: actions[0], securable })).to.equal(true)
    expect(acl.grants({ principals: principals[1], actions: actions[1], securable })).to.equal(true)
    expect(acl.grants({ principals, actions, securable })).to.equal(true)
    expect(acl.denies({ principals, actions, securable })).to.equal(false)

    acl.deny({ principal: principals[0], securable, action: actions[0] })

    expect(acl.grants({ principals: principals[0], actions: actions[0], securable })).to.equal(false)
    expect(acl.grants({ principals: principals[1], actions: actions[1], securable })).to.equal(true)
    expect(acl.grants({ principals, actions, securable })).to.equal(false)
    expect(acl.denies({ principals, actions, securable })).to.equal(true)
  })
})
