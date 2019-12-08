'use strict'

const Driver = require('../Driver')

class AqaraButtonGyroDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraButtonGyroDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_switch.aq3', callback)
	}
	
}

module.exports = AqaraButtonGyroDriver