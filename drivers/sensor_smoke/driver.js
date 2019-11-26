'use strict'

const Driver = require('../Driver')

class SmokeDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('SmokeDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_smoke', callback)
	}
	
}

module.exports = SmokeDriver