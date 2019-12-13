'use strict'

const Driver = require('../Driver')

class AqaraWirelessSwitch2016Driver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraWirelessSwitch2016Driver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_86sw2' || device.modelid === 'lumi.sensor_86sw2Un', callback)
	}
	
}

module.exports = AqaraWirelessSwitch2016Driver