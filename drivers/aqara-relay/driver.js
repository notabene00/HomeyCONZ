'use strict'

const Driver = require('../Driver')

class GenericPlugDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('GenericPlugDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.type === 'Smart plug' || device.type === 'On/Off plug-in unit', callback)
	}
}

module.exports = GenericPlugDriver