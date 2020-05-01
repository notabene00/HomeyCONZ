'use strict'

const Driver = require('../Driver')

class GenericLampDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('GenericLampDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => {
			return device.type !== 'Smart plug' && device.type !== 'On/Off plug-in unit' && device.type !== 'Window covering device' && device.type !== 'Configuration tool' && device.type !== 'Range extender' 
		}, callback)
	}
}

module.exports = GenericLampDriver