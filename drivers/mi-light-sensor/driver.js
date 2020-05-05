'use strict'

const Driver = require('../Driver')

class MiLightSensorDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('MiLightSensorDriver has been initiated')
	}
	
	onPairListDevices(_, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.sen_ill.mgl01' || device.modelid ==='SML001', callback)
	}

}

module.exports = MiLightSensorDriver