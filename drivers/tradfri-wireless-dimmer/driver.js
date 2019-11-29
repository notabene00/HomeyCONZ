'use strict'

const Driver = require('../Driver')

class TradfriWirelessDimmerDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TradfriWirelessDimmerDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'TRADFRI wireless dimmer', callback)
	}
	
}

module.exports = TradfriWirelessDimmerDriver