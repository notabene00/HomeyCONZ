'use strict'

const Driver = require('../Driver')

class AqaraOpple3GangSwitchDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraOpple3GangSwitchDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.remote.b686opcn01', callback)
	}
	
}

module.exports = AqaraOpple3GangSwitchDriver