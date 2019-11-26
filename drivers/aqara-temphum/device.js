'use strict'

const Sensor = require('../Sensor')

class AqaraTempHum extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.log(this.getName(), 'has been inited')
	}
	
}

module.exports = AqaraTempHum