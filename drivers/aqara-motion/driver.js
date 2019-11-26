'use strict'

const Driver = require('../Driver')

class AqaraMotionDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraMotionDriver has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => {
			return device.modelid === 'lumi.sensor_motion.aq2' && device.state.hasOwnProperty('lux')
		}, callback)
	}
	
}

module.exports = AqaraMotionDriver