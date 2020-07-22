'use strict'

const Driver = require('../Driver')

class AqaraOpple2GangSwitchDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraOpple2GangSwitchDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.remote.b486opcn01', callback)
	}
	
}

module.exports = AqaraOpple2GangSwitchDriver