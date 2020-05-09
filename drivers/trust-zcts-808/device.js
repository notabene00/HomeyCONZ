'use strict'

const Sensor = require('../Sensor')

class TrustZcts808 extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.log(this.getName(), 'has been initiated')
	}
	
}

module.exports = TrustZcts808