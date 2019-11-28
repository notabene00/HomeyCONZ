'use strict'

const Driver = require('../Driver')

class TradfriControlOutletDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('TradfriControlOutlet has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.modelid === 'TRADFRI control outlet', callback)
	}
	
}

module.exports = TradfriControlOutletDriver