'use strict'

const Driver = require('../Driver')

class TrustZcts808Driver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TrustZcts808Driver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'CSW_ADUROLIGHT', callback)
	}
	
}

module.exports = TrustZcts808Driver