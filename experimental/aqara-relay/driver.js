'use strict'

const Driver = require('../Driver')

class AqaraRelayDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraRelayDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.modelid === 'lumi.relay.c2acn01', callback)
	}
}

module.exports = AqaraRelayDriver