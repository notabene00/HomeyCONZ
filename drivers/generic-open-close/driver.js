'use strict'

const Driver = require('../Driver')

class GenericOpenCloseDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('GenericOpenCloseDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.type === 'ZHAOpenClose', callback)
	}
	
}

module.exports = GenericOpenCloseDriver