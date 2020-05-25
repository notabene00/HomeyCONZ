'use strict'

const Driver = require('../Driver')

class TrustZsdr850Driver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TrustZsdr850Driver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'SMOK_V16', callback)
	}
	
}

module.exports = TrustZsdr850Driver