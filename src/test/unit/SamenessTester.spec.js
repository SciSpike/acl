/* global describe,it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const uuid = require('uuid/v4')

const testSameness = require('../../main/SamenessTester')

class Thing {}

class ThingWithPublicId {
  constructor (id) {
    this.id = id || uuid()
  }
}

class ThingWithPrivateId {
  constructor (id) {
    this._id = id || uuid()
  }
}

class IdentifiableThing {
  constructor (iid) {
    this._iid = iid || uuid()
  }

  identifies (that) {
    return this._iid === that._iid
  }
}

describe('SamenessTester', () => {
  describe('classes', function () {
    it('should work using ===', function () {
      const t1 = new Thing()
      const t2 = new Thing()

      expect(testSameness(t1, t1)).to.equal(true)
      expect(testSameness(t1, t2)).to.equal(false)
    })

    it('should work using _id', function () {
      const id = uuid()
      const t1 = new ThingWithPrivateId(id)
      const t2 = new ThingWithPrivateId(id)
      const t3 = new ThingWithPrivateId(uuid())

      expect(testSameness(t1, t1)).to.equal(true)
      expect(testSameness(t1, t2)).to.equal(true)
      expect(testSameness(t1, t3)).to.equal(false)
    })

    it('should work using id', function () {
      const id = uuid()
      const t1 = new ThingWithPublicId(id)
      const t2 = new ThingWithPublicId(id)
      const t3 = new ThingWithPublicId(uuid())

      expect(testSameness(t1, t1)).to.equal(true)
      expect(testSameness(t1, t2)).to.equal(true)
      expect(testSameness(t1, t3)).to.equal(false)
    })

    it('should work using identifies', function () {
      const id = uuid()
      const t1 = new IdentifiableThing(id)
      const t2 = new IdentifiableThing(id)
      const t3 = new IdentifiableThing(uuid())

      expect(testSameness(t1, t1)).to.equal(true)
      expect(testSameness(t1, t2)).to.equal(true)
      expect(testSameness(t1, t3)).to.equal(false)
    })
  })

  describe('plain objects', function () {
    it('should work using ===', function () {
      const t1 = {}
      const t2 = {}

      expect(testSameness(t1, t1)).to.equal(true)
      expect(testSameness(t1, t2)).to.equal(false)
    })

    it('should work using _id', function () {
      const _id = uuid()
      const t1 = { _id }
      const t2 = { _id }
      const t3 = { _id: uuid() }

      expect(testSameness(t1, t1)).to.equal(true)
      expect(testSameness(t1, t2)).to.equal(true)
      expect(testSameness(t1, t3)).to.equal(false)
    })

    it('should work using id', function () {
      const id = uuid()
      const t1 = { id }
      const t2 = { id }
      const t3 = { id: uuid() }

      expect(testSameness(t1, t1)).to.equal(true)
      expect(testSameness(t1, t2)).to.equal(true)
      expect(testSameness(t1, t3)).to.equal(false)
    })
  })
})
