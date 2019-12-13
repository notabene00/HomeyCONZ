'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class AqaraWirelessSwitch2016 extends Sensor {
	
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
		}
	}
	
	setTriggers() {
		this.triggerLeftClicked = new Homey.FlowCardTriggerDevice('left_button_clicked').register()
		this.triggerRightClicked = new Homey.FlowCardTriggerDevice('right_button_clicked').register()
		this.triggerBothClicked = new Homey.FlowCardTriggerDevice('both_buttons_clicked').register()
	}
	
}

module.exports = AqaraWirelessSwitch2016