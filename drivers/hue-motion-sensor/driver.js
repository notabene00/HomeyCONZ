'use strict'

const Driver = require('../Driver')

class HueMotionDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HueMotionDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'SML001', callback)
	}

}

module.exports = HueMotionDriver