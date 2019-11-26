'use strict'

const Driver = require('../Driver')

class LeakageDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('LeakageDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_wleak.aq1', callback)
	}
	
}

module.exports = LeakageDriver