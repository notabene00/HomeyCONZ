'use strict'

const Driver = require('../Driver')

class FellerSwitchDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('FellerSwitchDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'FOHSWITCH', callback)
	}
	
}

module.exports = FellerSwitchDriver