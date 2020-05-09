'use strict'

const Driver = require('../Driver')

class HueOutdoorMotionDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HueOutdoorMotionDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'SML002', callback)
	}

}

module.exports = HueOutdoorMotionDriver