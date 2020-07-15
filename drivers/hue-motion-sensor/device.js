'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class HueMotion extends Sensor {
	
	onInit() {
		super.onInit()
				
		this.setTriggers()

		this.log(this.getName(), 'has been initiated')
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
				}
				
				if(this.getCapabilityValue('alarm_motion') === false)
				{
					super.setCapabilityValue(name, true)
				}
			}
		} else {
			super.setCapabilityValue(name, value)
		}
	}
	
	async onSettings( oldSettingsObj, newSettingsObj, changedKeysArr ) {
		this.putSensorConfig( { config: { sensitivity: newSettingsObj.sensitivity, ledindication: newSettingsObj.ledindication } }, (error, data) => {
			if (error) {
				throw new Error(error);
			}
		})
	}

	setTriggers() {
		this.triggerSecondaryNoMotion = new Homey.FlowCardTriggerDevice('secondary_no_motion_trigger').register()
	}

}

module.exports = HueMotion