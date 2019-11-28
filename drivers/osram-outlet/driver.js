'use strict'

const Driver = require('../Driver')

class OsramControlOutletDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('OsramControlOutlet has been inited')
	}
	
	onPairListDevices(data, callback) {
		this.getLightsByCondition(device => device.modelid === 'Plug 01', callback)
	}
	
}

module.exports = OsramControlOutletDriver