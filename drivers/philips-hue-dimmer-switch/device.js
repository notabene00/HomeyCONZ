'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class PhilipsHueDimmerSwitch extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been inited')
	}
	
	fireEvent(number) {
		switch (number) {
			//turn on single press

			case 1002:
				this.log('turn on single press')
				this.turnOnSingle.trigger(this)
				break

			//turn on longpress

			case 1001:
				this.timeWhenPressed = new Date().getTime()
				setTimeout(() => {
					if (this.timeWhenPressed != 0) {
						this.turnOnHeld.trigger(this)
						this.log('turn on held')
					}
				}, 0.5 * 1000)
				break

			//turn on released

			case 1003:
				this.log('turn on released')
				this.turnOnReleased.trigger(this)
				break

			//Dim up single press

			case 2002:
				this.log('dim up single press')
				this.dimUpSingle.trigger(this)
				break

			//Dim up longpress

			case 2001:
				this.timeWhenPressed = new Date().getTime()
				setTimeout(() => {
					if (this.timeWhenPressed != 0) {
						this.dimUpHeld.trigger(this)
						this.log('dim up held')
					}
				}, 0.5 * 1000)
				break

			//Dim up released

			case 2003:
				this.log('dim up released')
				this.dimUpReleased.trigger(this)
				break
				
			//Dim down single press

			case 3002:
				this.log('dim down single press')
				this.dimDownSingle.trigger(this)
				break

			//Dim down longpress

			case 3001:
				this.timeWhenPressed = new Date().getTime()
				setTimeout(() => {
					if (this.timeWhenPressed != 0) {
						this.dimDownHeld.trigger(this)
						this.log('dim down held')
					}
				}, 0.5 * 1000)
				break

			//Dim down released

			case 3003:
				this.log('dim down released')
				this.dimDownReleased.trigger(this)
				break
			
			//turn off single press

			case 4002:
				this.log('turn off single press')
				this.turnOffSingle.trigger(this)
				break

			//turn off longpress

			case 4001:
				this.timeWhenPressed = new Date().getTime()
				setTimeout(() => {
					if (this.timeWhenPressed != 0) {
						this.turnOffHeld.trigger(this)
						this.log('turn off held')
					}
				}, 0.5 * 1000)
				break
				
			
			//turn off released

			case 4003:
				this.log('turn off released')
				this.turnOffReleased.trigger(this)
				break

		}
	}
	
	setTriggers() {
		
		//turn on button
		this.turnOnHeld = new Homey.FlowCardTriggerDevice('turn_on_held').register()
		this.turnOnSingle = new Homey.FlowCardTriggerDevice('turn_on_single_press').register()
		this.turnOnReleased = new Homey.FlowCardTriggerDevice('turn_on_released').register()

		//Dim up button
		this.dimUpHeld = new Homey.FlowCardTriggerDevice('dim_up_held').register()
		this.dimUpSingle = new Homey.FlowCardTriggerDevice('dim_up_single_press').register()
		this.dimUpReleased = new Homey.FlowCardTriggerDevice('dim_up_released').register()

		//Dim down button
		this.dimDownHeld = new Homey.FlowCardTriggerDevice('dim_down_held').register()
		this.dimDownSingle = new Homey.FlowCardTriggerDevice('dim_down_single_press').register()
		this.dimDownReleased = new Homey.FlowCardTriggerDevice('dim_down_released').register()
		
		//turn off button
		this.turnOffHeld = new Homey.FlowCardTriggerDevice('turn_off_held').register()
		this.turnOffSingle = new Homey.FlowCardTriggerDevice('turn_off_single_press').register()
		this.turnOffReleased = new Homey.FlowCardTriggerDevice('turn_off_released').register()
	}
	
}

module.exports = PhilipsHueDimmerSwitch