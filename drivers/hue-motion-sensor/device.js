'use strict'

const Sensor = require('../Sensor')

class HueMotion extends Sensor {
	
	onInit() {
		super.onInit()
				
		this.log(this.getName(), 'has been initiated')
	}
	
	setCapabilityValue(name, value) {
		if (name === 'alarm_motion') {
			if (!value) {
				// no motion detected
				// set the timer to turn off the sensor
				this.timeout = setTimeout(() => {
					super.setCapabilityValue(name, false)
					this.timeout = null
				}, this.getSetting('no_motion_timeout') * 1000)
			} else {
				// motion detected
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
	
	async onSettings( oldSettingsObj, newSettingsObj, changedKeysArr ) {
		this.putSensorConfig({config:{sensitivity:newSettingsObj.sensitivity}}, (error, data) => {
			if (error) {
				throw new Error(error);
			}
		})
	}

}

module.exports = HueMotion