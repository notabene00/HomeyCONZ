'use strict'

const Driver = require('../Driver')

class MiMotionDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('MiMotionDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_motion', callback)
	}

}

module.exports = MiMotionDriver