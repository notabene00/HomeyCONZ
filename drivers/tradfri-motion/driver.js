'use strict'

const Driver = require('../Driver')

class TradfriMotionDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TradfriMotionDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'TRADFRI motion sensor', callback)
	}

}

module.exports = TradfriMotionDriver