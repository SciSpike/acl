'use strict'

const uuid = require('uuid/v4')
const { Trait } = require('mutrait')

const Identifiable = Trait(s => class extends s {
  constructor () {
    super(...arguments)
    this._id = uuid()
  }

  get id () {
    return this._id
  }

  identifies (that) {
    return this === that || (that && this.id === that.id)
  }
})

module.exports = Identifiable
