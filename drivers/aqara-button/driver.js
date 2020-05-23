'use strict'

const Driver = require('../Driver')

class AqaraButtonDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraButtonDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_switch.aq2' || device.modelid === 'lumi.remote.b1acn01', callback)
	}
	
}

module.exports = AqaraButtonDriver