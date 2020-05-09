'use strict'

const Driver = require('../Driver')

class TrustZpir8000Driver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TrustZpir8000Driver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'VMS_ADUROLIGHT', callback)
	}

}

module.exports = TrustZpir8000Driver