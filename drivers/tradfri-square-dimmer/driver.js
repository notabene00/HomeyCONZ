'use strict'

const Driver = require('../Driver')

class TradfriSquareDimmerDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TradfriSquareDimmerDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'TRADFRI on/off switch' || device.modelid === 'TRADFRI open/close remote', callback)
	}
	
}

module.exports = TradfriSquareDimmerDriver