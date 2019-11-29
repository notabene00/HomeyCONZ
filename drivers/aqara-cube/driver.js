'use strict'

const Driver = require('../Driver')

class CubeDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('CubeDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sensor_cube.aqgl01', callback)
	}
	
}

module.exports = CubeDriver