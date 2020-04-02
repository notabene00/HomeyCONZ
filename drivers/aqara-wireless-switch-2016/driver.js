'use strict'

const Driver = require('../Driver')

class AqaraWirelessSwitch2016Driver extends Driver {

	onInit() {
		super.onInit()
		this.log('AqaraWirelessSwitch2016Driver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => ['lumi.sensor_86sw2', 'lumi.sensor_86sw2Un', 'lumi.remote.b186acn01'].includes(device.modelid), callback)
	}

}

module.exports = AqaraWirelessSwitch2016Driver
