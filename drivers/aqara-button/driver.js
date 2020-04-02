'use strict'

const Driver = require('../Driver')

class AqaraButtonDriver extends Driver {

	onInit() {
		super.onInit()
		this.log('AqaraButtonDriver has been initiated')
	}

	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => ['lumi.remote.b1acn01', 'lumi.sensor_switch.aq2'].includes(device.modelid), callback)
	}

}

module.exports = AqaraButtonDriver
