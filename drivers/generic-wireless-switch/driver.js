'use strict'

const Driver = require('../Driver')

class GenericWirelessSwitchDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('GenericWirelessSwitchDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.type === 'ZHASwitch', callback)
	}
	
}

module.exports = GenericWirelessSwitchDriver