'use strict'

const Driver = require('../Driver')

class AqaraWirelessSwitch2018DoubleRockerDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraWirelessSwitch2018DoubleRockerDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.remote.b286acn01' || device.modelid === 'lumi.remote.b286acn02', callback)
	}
	
}

module.exports = AqaraWirelessSwitch2018DoubleRockerDriver