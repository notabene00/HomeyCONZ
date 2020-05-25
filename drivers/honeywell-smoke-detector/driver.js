'use strict'

const Driver = require('../Driver')

class HoneywellSmokeDetectorDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HoneywellSmokeDetectorDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_smoke', callback)
	}
	
}

module.exports = HoneywellSmokeDetectorDriver