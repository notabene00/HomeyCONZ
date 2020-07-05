'use strict'

const Driver = require('../Driver')

class AqaraWallSwitchDoubleRockerDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraWallSwitchDoubleRockerDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.ctrl_ln2.aq1' || device.modelid === 'lumi.ctrl_neutral2', callback)
	}
	
}

module.exports = AqaraWallSwitchDoubleRockerDriver