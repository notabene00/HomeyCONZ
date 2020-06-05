'use strict'

const Driver = require('../Driver')

class MiPlugDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('MiPlugDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.modelid === 'lumi.plug.mmeu01', callback)
	}
}

module.exports = MiPlugDriver