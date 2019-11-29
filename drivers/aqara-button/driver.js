'use strict'

const Driver = require('../Driver')

class AqaraButtonDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraButtonDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_switch.aq2', callback)
	}
	
}

module.exports = AqaraButtonDriver