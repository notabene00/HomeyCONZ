'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class AqaraVibration extends Sensor {
	
	onInit() {
		super.onInit()
				
		this.setTriggers()
		
		this.log(this.getName(), 'has been initiated')	
	}
	
	setTriggers() {
		// this.motionToggleTrigger = new Homey.FlowCardTriggerDevice('motion_toggle').register()
	}
	
	setCapabilityValue(name, value) {
		super.setCapabilityValue(name, value)
		if (name == 'tilt_angle') {
			super.setCapabilityValue('tilt_alarm', true)
			// относительный угол
			let relative_angle = value - super.getCapabilityValue('tilt_angle')
			super.setCapabilityValue('relative_tilt_angle', relative_angle)
			this.timeout = setTimeout(() => {
				super.setCapabilityValue('tilt_alarm', false)
				// this.motionToggleTrigger.trigger(this)
				this.timeout = null
			}, this.getSetting('no_tilt_timeout') * 1000)
		}
	}
	
}

module.exports = AqaraVibration