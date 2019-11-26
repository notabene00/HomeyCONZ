'use strict'

const Light = require('../Light')
const { FlowCardTriggerDevice } = require('homey')

class Plug extends Light {
	
	onInit() {
		super.onInit()

		this.setTriggers()
		
		this.log(this.getName(), 'has been inited')
	}

	setTriggers() {
		this.triggerSwitched = new FlowCardTriggerDevice('switched').register()
	}

	setCapabilityValue(name, value) {
		if (name === 'onoff' && value != this.getCapabilityValue(name)) {
			this.triggerSwitched.trigger(this)
		}
		super.setCapabilityValue(name, value)
	}
	
}

module.exports = Plug