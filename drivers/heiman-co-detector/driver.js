'use strict'

const Driver = require('../Driver')

class HeimanCoDetectorDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HeimanCoDetectorDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'COSensor-EM', callback)
	}
	
}

module.exports = HeimanCoDetectorDriver