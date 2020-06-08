'use strict'

const Driver = require('../Driver')

class AqaraPlugDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraPlugDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.modelid === 'lumi.plug.maeu01', callback)
	}
}

module.exports = AqaraPlugDriver