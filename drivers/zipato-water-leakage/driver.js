'use strict'

const Driver = require('../Driver')

class ZipatoWaterLeakageDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('ZipatoWaterLeakageDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'HM-HS1WL-M', callback)
	}
	
}

module.exports = ZipatoWaterLeakageDriver