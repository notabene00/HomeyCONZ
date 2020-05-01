'use strict'

const Driver = require('../Driver')

class TradfriSignalRepeaterDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TradfriSignalRepeaterDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => {
			return device.type === 'Range extender' 
		}, callback)
	}
}

module.exports = TradfriSignalRepeaterDriver