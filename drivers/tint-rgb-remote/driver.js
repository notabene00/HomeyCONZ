'use strict'

const Driver = require('../Driver')

class TintRgbRemoteDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TintRgbRemoteDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'ZBT-Remote-ALL-RGBW', callback)
	}
	
}

module.exports = TintRgbRemoteDriver