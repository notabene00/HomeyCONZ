'use strict'

const Sensor = require('../Sensor')

class GenericOpenClose extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.log(this.getName(), 'has been initiated')
	}
	
}

module.exports = GenericOpenClose