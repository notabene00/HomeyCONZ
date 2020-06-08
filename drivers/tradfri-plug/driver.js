'use strict'

const Driver = require('../Driver')

class TradfriPlugDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TradfriPlugDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.modelid === 'TRADFRI control outlet', callback)
	}
}

module.exports = TradfriPlugDriver