'use strict'

const Driver = require('../Driver')

class AqaraOpple1GangSwitchDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraOpple1GangSwitchDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.remote.b286opcn01', callback)
	}
	
}

module.exports = AqaraOpple1GangSwitchDriver