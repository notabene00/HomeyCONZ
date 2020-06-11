'use strict'

const Driver = require('../Driver')

class DevelcoWaterLeakageDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('DevelcoWaterLeakageDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'FLSZB-110', callback)
	}
	
}

module.exports = DevelcoWaterLeakageDriver