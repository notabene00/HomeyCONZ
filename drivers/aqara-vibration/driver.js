'use strict'

const Driver = require('../Driver')

class AqaraVibrationDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraVibrationDriver has been initiated')
	}
	
	onPairListDevices(_, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.vibration.aq1', callback)
	}
	
}

module.exports = AqaraVibrationDriver