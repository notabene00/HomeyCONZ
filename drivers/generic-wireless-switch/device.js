'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class GenericWirelessSwitch extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been initiated')
	}
	
	fireEvent(number) {
		switch (number) {
			case 1002:
				this.log('left clicked')
				this.triggerLeftClicked.trigger(this)
				break		
			case 2002:
				this.log('right clicked')
				this.triggerRightClicked.trigger(this)
				break
			case 3002:
				this.log('both clicked')
				this.triggerBothClicked.trigger(this)
				break
			case 1001:
				this.log('left held')
				this.triggerLeftHeld.trigger(this)
				break		
			case 2001:
				this.log('right held')
				this.triggerRightHeld.trigger(this)
				break
			case 3001:
				this.log('both held')
				this.triggerBothHeld.trigger(this)
				break
			case 1004:
				this.log('left double clicked')
				this.triggerLeftDoubleClicked.trigger(this)
				break		
			case 2004:
				this.log('right double clicked')
				this.triggerRightDoubleClicked.trigger(this)
				break
			case 3004:
				this.log('both double clicked')
				this.triggerBothDoubleClicked.trigger(this)
				break
		}
	}
	
	setTriggers() {
		this.triggerLeftClicked = new Homey.FlowCardTriggerDevice('left_button_clicked').register()
		this.triggerRightClicked = new Homey.FlowCardTriggerDevice('right_button_clicked').register()
		this.triggerBothClicked = new Homey.FlowCardTriggerDevice('both_buttons_clicked').register()
		this.triggerLeftHeld = new Homey.FlowCardTriggerDevice('left_button_held').register()
		this.triggerRightHeld = new Homey.FlowCardTriggerDevice('right_button_held').register()
		this.triggerBothHeld = new Homey.FlowCardTriggerDevice('both_buttons_held').register()
		this.triggerLeftDoubleClicked = new Homey.FlowCardTriggerDevice('left_button_double_clicked').register()
		this.triggerRightDoubleClicked = new Homey.FlowCardTriggerDevice('right_button_double_clicked').register()
		this.triggerBothDoubleClicked = new Homey.FlowCardTriggerDevice('both_buttons_double_clicked').register()
	}
	
}

module.exports = GenericWirelessSwitch