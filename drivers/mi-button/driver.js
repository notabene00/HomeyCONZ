'use strict'

const Driver = require('../Driver')

class MiButtonDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('MiButtonDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_switch', callback)
	}
	
}

module.exports = MiButtonDriver