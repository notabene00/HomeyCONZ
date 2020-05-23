'use strict'

const Driver = require('../Driver')

class HueTapDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('HueTapDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'ZGPSWITCH' && device.manufacturername === 'Philips', callback)
	}
	
}

module.exports = HueTapDriver