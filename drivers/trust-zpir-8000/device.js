'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class TrustZpir8000 extends Sensor {
	
	onInit() {
		super.onInit()
				
		this.setTriggers()

		this.log(this.getName(), 'has been initiated')	
	}

	setTriggers() {
		this.triggerSecondaryNoMotion = new Homey.FlowCardTriggerDevice('secondary_no_motion_trigger').register()
	}

	setCapabilityValue(name, value) {
		if (name === 'alarm_motion') {
			if (!value) {
				// no motion detected
				// set the timer to turn off the sensor
				this.timeout = setTimeout(() => {
					super.setCapabilityValue(name, false)
					this.timeout = null

					this.secondaryTimeout = setTimeout(() => {
						this.triggerSecondaryNoMotion.trigger(this)
						this.secondaryTimeout = null
					}, this.getSetting('secondary_no_motion_timeout') * 1000)

				}, this.getSetting('no_motion_timeout') * 1000)
			} else {
				// motion detected

				if(this.secondaryTimeout){
					clearTimeout(this.secondaryTimeout)
					this.secondaryTimeout = null
				}

				if (this.timeout) {
					// if you have a timer, clear it
					// if there is a timer, the sensor still detects movement
					clearTimeout(this.timeout)
					this.timeout = null
				} else {
					// if there is no timer, make the sensor in the kolobok detect movement
					super.setCapabilityValue(name, true)
				}
			}
		} else {
			super.setCapabilityValue(name, value)
		}
	}
	
}

module.exports = TrustZpir8000