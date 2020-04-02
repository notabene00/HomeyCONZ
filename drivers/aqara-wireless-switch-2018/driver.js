'use strict'

const Driver = require('../Driver')

class AqaraWirelessSwitch2018Driver extends Driver {

	onInit() {
		super.onInit()
		this.log('AqaraWirelessSwitch2018Driver has been initiated')
	}

	onPairListDevices(_, callback) {
		this.getSensorsByCondition(device => device.modelid == 'lumi.remote.b286acn01'), callback)
	}

}

module.exports = AqaraWirelessSwitch2018Driver
