'use strict'

const Driver = require('../Driver')

class AqaraWirelessSwitch2016SingleRockerDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraWirelessSwitch2016SingleRockerDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_86sw1', callback)
	}
	
}

module.exports = AqaraWirelessSwitch2016SingleRockerDriver