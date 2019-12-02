'use strict'

const Driver = require('../Driver')

class TradfriRemoteControlDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TradfriRemoteControlDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'TRADFRI remote control', callback)
	}
	
}

module.exports = TradfriRemoteControlDriver