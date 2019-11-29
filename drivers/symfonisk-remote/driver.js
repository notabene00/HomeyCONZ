'use strict'

const Driver = require('../Driver')

class SymfoniskRemoteDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('SymfoniskRemoteDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'SYMFONISK Sound Controller', callback)
	}
	
}

module.exports = SymfoniskRemoteDriver