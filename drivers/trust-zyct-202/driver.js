'use strict'

const Driver = require('../Driver')

class TrustZYCT202SwitchDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TrustZYCT202SwitchDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'ZYCT-202', callback)
	}
	
}

module.exports = TrustZYCT202SwitchDriver