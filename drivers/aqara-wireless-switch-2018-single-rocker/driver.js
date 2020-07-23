'use strict'

const Driver = require('../Driver')

class AqaraWirelessSwitch2018SingleRockerDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraWirelessSwitch2018SingleRockerDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.remote.b186acn01' || device.modelid === 'lumi.remote.b186acn02', callback)
	}
	
}

module.exports = AqaraWirelessSwitch2018SingleRockerDriver