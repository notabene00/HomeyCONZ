'use strict'

const Driver = require('../Driver')

class MijiaTempHumDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('MijiaTempHumDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_ht', callback)
	}
	
}

module.exports = MijiaTempHumDriver