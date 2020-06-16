'use strict'

const Driver = require('../Driver')

class SonoffBasicDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('SonoffBasicDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.modelid === 'BASICZBR3', callback)
	}
}

module.exports = SonoffBasicDriver