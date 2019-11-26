'use strict'

const Driver = require('../Driver')

class PlugDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('PlugDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.type === 'Smart plug', callback)
	}
	
}

module.exports = PlugDriver