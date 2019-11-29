'use strict';

const Driver = require('../Driver')

class BlindsDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('BlindsDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.type === 'Window covering device', callback)
	}
	
}

module.exports = BlindsDriver