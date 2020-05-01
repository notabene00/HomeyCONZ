'use strict'

const Light = require('../Light')

class GenericLamp extends Light {
	
	onInit() {
		super.onInit()
		
		this.log(this.getName(), 'has been initiated')
	}
	
}

module.exports = GenericLamp