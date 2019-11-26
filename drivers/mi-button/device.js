'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class MiButton extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been inited')
	}
	
	fireEvent(number) {
		switch (number) {
			case 1000:
				this.timeWhenPressed = new Date().getTime()
				setTimeout(() => {
					if (this.timeWhenPressed != 0) {
						this.triggerHeld.trigger(this)
						this.log('held')
					}
				}, 0.5 * 1000)
				break
			case 1002:
				let now = new Date().getTime()
				if (now - this.timeWhenPressed < 500) {
					this.triggerPressedOnce.trigger(this)
					this.log('pressed once')
				} else {
					this.triggerReleased.trigger(this)
					this.log('released')
				}
				this.timeWhenPressed = 0
				break
			case 1004:
				this.log('pressed twice')
				this.triggerPressedTwice.trigger(this)
				break
			case 1005:
				this.log('pressed thrice')
				this.triggerPressedThrice.trigger(this)
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
		this.triggerPressedThrice = new Homey.FlowCardTriggerDevice('3_button_press').register()
		this.triggerPressedFourfold = new Homey.FlowCardTriggerDevice('4_button_press').register()
		this.triggerHeld = new Homey.FlowCardTriggerDevice('button_held').register()
		this.triggerReleased = new Homey.FlowCardTriggerDevice('button_released').register()
	}
	
}

module.exports = MiButton