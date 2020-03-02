'use strict'

const Driver = require('../Driver')

class AqaraWirelessSwitch2018Driver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraWirelessSwitch2018Driver has been initiated')
	}
	
	onPairListDevices(_, callback) {
		this.getSensorsByCondition(device => ['lumi.remote.b286acn01', 'lumi.remote.b1acn01', 'lumi.remote.b186acn01'].includes(device.modelid), callback)
	}
	
}

module.exports = AqaraWirelessSwitch2018Driver