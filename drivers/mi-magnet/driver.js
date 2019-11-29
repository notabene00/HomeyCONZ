'use strict'

const Driver = require('../Driver')

class MiMagnetDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('MiMagnetDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_magnet', callback)
	}
	
}

module.exports = MiMagnetDriver