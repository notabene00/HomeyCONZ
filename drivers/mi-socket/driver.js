'use strict'

const Driver = require('../Driver')

class MiSocketDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('MiSocketDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.modelid === 'lumi.plug', callback)
	}
}

module.exports = MiSocketDriver