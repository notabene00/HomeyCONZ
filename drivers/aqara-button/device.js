'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class AqaraButton extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been initiated')
	}
	
	fireEvent(number) {
		switch (number) {
			case 1002:
				this.log('pressed once')
				this.triggerPressedOnce.trigger(this)
				break		
			case 1004:
				this.log('pressed twice')
				this.triggerPressedTwice.trigger(this)
				break
			case 1005:
				this.log('pressed threefold')
				this.triggerPressedThreefold.trigger(this)
				break
			case 1006:
				this.log('pressed fourfold')
				this.triggerPressedFourfold.trigger(this)
				break
		}
	}
	
	setTriggers() {
		this.triggerPressedOnce = new Homey.FlowCardTriggerDevice('1_button_press').register()
		this.triggerPressedTwice = new Homey.FlowCardTriggerDevice('2_button_press').register()
		this.triggerPressedThreefold = new Homey.FlowCardTriggerDevice('3_button_press').register()
		this.triggerPressedFourfold = new Homey.FlowCardTriggerDevice('4_button_press').register()
	}
	
}

module.exports = AqaraButton