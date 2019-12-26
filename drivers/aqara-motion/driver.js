'use strict'

const Driver = require('../Driver')

class AqaraMotionDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraMotionDriver has been initiated')
	}
	
	onPairListDevices(_, callback) {
		this.getSensorsByCondition(device => {
			return device.modelid === 'lumi.sensor_motion.aq2' && device.state.hasOwnProperty('lux')
		}, callback)
	}
	
}

module.exports = AqaraMotionDriver