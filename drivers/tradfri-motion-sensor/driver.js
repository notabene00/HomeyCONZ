'use strict'

const Driver = require('../Driver')

class TradfriMotionSensorDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TradfriMotionSensorDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'TRADFRI motion sensor', callback)
	}

}

module.exports = TradfriMotionSensorDriver