'use strict'

const Driver = require('../Driver')

class DevelcoMotionDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('DevelcoMotionDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'MOSZB-130', callback)
	}

}

module.exports = DevelcoMotionDriver