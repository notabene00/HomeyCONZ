'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class TradfriRemoteControl extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been inited')
	}
	
	fireEvent(number) {
		switch (number) {
			case 1002:
				this.log('onoff button')
				this.onoff.trigger(this)
				break

			//Dim up longpress

			case 2001:
				this.timeWhenPressed = new Date().getTime()
				setTimeout(() => {
					if (this.timeWhenPressed != 0) {
						this.dimupheld.trigger(this)
						this.log('dim up held')
					}
				}, 0.5 * 1000)
				break

				//Dim up single press

			case 2002:
				this.log('dim up single press')
				this.dimupsingle.trigger(this)
				break

				//Dim up released

			case 2003:
				this.log('dim up released')
				this.dimupreleased.trigger(this)
				break
				

				//Dim down longpress

			case 3001:
				this.timeWhenPressed = new Date().getTime()
				setTimeout(() => {
					if (this.timeWhenPressed != 0) {
						this.dimdownheld.trigger(this)
						this.log('dim down held')
					}
				}, 0.5 * 1000)
				break

				//Dim down single press

			case 3002:
				this.log('dim down single press')
				this.dimdownsingle.trigger(this)
				break

				//Dim down released

			case 3003:
				this.log('dim down released')
				this.dimdownreleased.trigger(this)
				break
				
				//Scene right longpress

			case 5001:
				this.timeWhenPressed = new Date().getTime()
				setTimeout(() => {
					if (this.timeWhenPressed != 0) {
						this.scenerightheld.trigger(this)
						this.log('scene right held')
					}
				}, 0.5 * 1000)
				break

				//Scene right single press

			case 5002:
				this.log('scene right single press')
				this.scenerightsingle.trigger(this)
				break

				//scene right released

			case 5003:
				this.log('scene right released')
				this.scenerightreleased.trigger(this)
				break


				//Scene left longpress

			case 4001:
				this.timeWhenPressed = new Date().getTime()
				setTimeout(() => {
					if (this.timeWhenPressed != 0) {
						this.sceneleftheld.trigger(this)
						this.log('scene left held')
					}
				}, 0.5 * 1000)
				break
				
				//Scene left single press

			case 4002:
				this.log('scene left single press')
				this.sceneleftsingle.trigger(this)
				break

				//scene left released

			case 4003:
				this.log('scene left released')
				this.sceneleftreleased.trigger(this)
				break

		}
	}
	
	setTriggers() {
		
		//Ononff 
		this.onoff = new Homey.FlowCardTriggerDevice('on_off_button_pressed').register()


		//Dim up button
		this.dimupheld = new Homey.FlowCardTriggerDevice('dim_up_held').register()
		this.dimupsingle = new Homey.FlowCardTriggerDevice('dim_up_single_press').register()
		this.dimupreleased = new Homey.FlowCardTriggerDevice('dim_up_released').register()


		//Dim down button
		this.dimdownheld = new Homey.FlowCardTriggerDevice('dim_down_held').register()
		this.dimdownsingle = new Homey.FlowCardTriggerDevice('dim_down_single_press').register()
		this.dimdownreleased = new Homey.FlowCardTriggerDevice('dim_down_released').register()
		

		//Scene right button
		this.scenerightheld = new Homey.FlowCardTriggerDevice('scene_right_held').register()
		this.scenerightsingle = new Homey.FlowCardTriggerDevice('scene_right_single_press').register()
		this.scenerightreleased = new Homey.FlowCardTriggerDevice('scene_right_released').register()


		//Scene left button
		this.sceneleftheld = new Homey.FlowCardTriggerDevice('scene_left_held').register()
		this.sceneleftsingle = new Homey.FlowCardTriggerDevice('scene_left_single_press').register()
		this.sceneleftreleased = new Homey.FlowCardTriggerDevice('scene_left_released').register()
		
	}
	
}

module.exports = TradfriRemoteControl