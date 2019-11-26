'use strict'

const Light = require('../Light')

class Blinds extends Light {
	
	onInit() {
		super.onInit()
		
		this.log(this.getName() + 'has been inited')
	}
	
	setCapabilityValue(name, value) {
		if (name === 'onoff') {
			super.setCapabilityValue(name, !value)
		} else if (name === 'dim') {
			super.setCapabilityValue(name, 1 - value)
		}
	}
}

module.exports = Blinds