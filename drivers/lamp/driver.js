'use strict'

const Driver = require('../Driver')

class LampDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('LampDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => {
			return device.type !== 'Smart plug' && device.type !== 'On/Off plug-in unit' && device.type !== 'Window covering device'
		}, callback)
	}
}

module.exports = LampDriver