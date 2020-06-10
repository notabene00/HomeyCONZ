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

				if(this.secondaryTimeout){
					clearTimeout(this.secondaryTimeout)
					this.secondaryTimeout = null
				}
				
				// set the timer to turn off the sensor
				this.timeout = setTimeout(() => {
					clearTimeout(this.timeout)
					this.timeout = null

					if(this.getCapabilityValue('alarm_motion') === false){
						return
					}

					super.setCapabilityValue(name, false)

					this.secondaryTimeout = setTimeout(() => {
						clearTimeout(this.secondaryTimeout)
						this.secondaryTimeout = null

						this.triggerSecondaryNoMotion.trigger(this)
					}, this.getSetting('secondary_no_motion_timeout') * 1000)

				}, this.getSetting('no_motion_timeout') * 1000)

			} else if (value) { // motion detected
				
				if(this.secondaryTimeout){
					clearTimeout(this.secondaryTimeout)
					this.secondaryTimeout = null
				}

				if (this.timeout) {
					clearTimeout(this.timeout)
					this.timeout = null
				} else {
					super.setCapabilityValue(name, true)
				}
			}
		} else {
			super.setCapabilityValue(name, value)
		}
	}
	
}

module.exports = TrustZpir8000