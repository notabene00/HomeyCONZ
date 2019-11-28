'use strict'

const Driver = require('../Driver')

class TradfriRoundDimmerDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TradfriRoundDimmerDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'TRADFRI wireless dimmer', callback)
	}
	
}

module.exports = TradfriRoundDimmerDriver