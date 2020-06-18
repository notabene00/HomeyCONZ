'use strict'

const Driver = require('../Driver')

class AqaraRelayDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraRelayDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		// todo: handle the second light by either
		// -> provide two separate lights, then need to ensure that the measuremenet applies to both (or simply drop that)?
		// -> provide one device with two light controlls
		this.getLightsByCondition(device => device.modelid === 'lumi.relay.c2acn01', callback)
	}
}

module.exports = AqaraRelayDriver