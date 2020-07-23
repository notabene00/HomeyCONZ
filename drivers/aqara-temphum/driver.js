'use strict'

const Driver = require('../Driver')

class AqaraTempHumDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraTempHumDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.weather' || device.modelid === 'lumi.sensor_ht.agl02', callback)
	}
	
}

module.exports = AqaraTempHumDriver