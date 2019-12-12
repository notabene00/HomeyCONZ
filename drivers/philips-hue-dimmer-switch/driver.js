'use strict'

const Driver = require('../Driver')

class PhilipsHueDimmerSwitchDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('PhilipsHueDimmerSwitchDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'RWL021', callback)
	}
	
}

module.exports = PhilipsHueDimmerSwitchDriver