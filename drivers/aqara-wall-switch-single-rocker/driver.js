'use strict'

const Driver = require('../Driver')

class AqaraWallSwitchSingleRockerDriver extends Driver {
	
	onInit() {
		super.onInit()
		this.log('AqaraWallSwitchSingleRockerDriver has been initiated')
	}
	
	onPairListDevices(data, callback) {
		this.getSensorsByCondition(device => device.modelid === 'lumi.ctrl_ln1.aq1' || device.modelid === 'lumi.ctrl_neutral1', callback)
	}
	
}

module.exports = AqaraWallSwitchSingleRockerDriver