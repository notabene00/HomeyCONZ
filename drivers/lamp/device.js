'use strict'

const Light = require('../Light')

class Lamp extends Light {
	
	onInit() {
		super.onInit()
		
		this.log(this.getName(), 'has been inited')
	}
	
	

}

module.exports = Lamp