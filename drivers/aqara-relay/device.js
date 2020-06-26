'use strict'

const Light = require('../Light')
const { FlowCardTriggerDevice } = require('homey')

class AqaraRelay extends Light {
	
	onInit() {
		super.onInit()

		this.setTriggers()
		
		this.log(this.getName(), 'has been initiated')
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

	setCapabilityValue(name, value) {
		if (name === 'measure_power' && value === -1) {
			return 
		} else {
			super.setCapabilityValue(name, value)
		}
	}
	
}

module.exports = AqaraRelay