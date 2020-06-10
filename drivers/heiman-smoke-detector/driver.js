'use strict'

const Driver = require('../Driver')

class HeimanSmokeDetectorDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HeimanSmokeDetectorDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'SmokeSensor-N-3.0', callback)
	}
	
}

module.exports = HeimanSmokeDetectorDriver