'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class AqaraButtonGyro extends Sensor {
	
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
			case 1003:
				this.log('held')
				this.triggerHeld.trigger(this)
				break
			case 1004:
				this.log('pressed twice')
				this.triggerPressedTwice.trigger(this)
				break
			case 1007:
				this.log('shaked')
				this.triggerShaked.trigger(this)
				break
		}
	}
	
	setTriggers() {
		this.triggerPressedOnce = new Homey.FlowCardTriggerDevice('1_button_press').register()
		this.triggerPressedTwice = new Homey.FlowCardTriggerDevice('2_button_press').register()
		this.triggerHeld = new Homey.FlowCardTriggerDevice('button_held').register()
		this.triggerShaked = new Homey.FlowCardTriggerDevice('shake').register()
	}
	
}

module.exports = AqaraButtonGyro