'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class Cube extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been inited')
	}
	
	fireEvent(number) {
		let fourthDigit = Math.floor((number / 1) % 10)
		let thirdDigit = Math.floor((number / 10) % 10)
		let secondDigit = Math.floor((number / 100) % 10)
		let firstDigit = Math.floor((number / 1000) % 10)
		this.log(fourthDigit, thirdDigit, secondDigit, firstDigit)
		if (number == 7000) {
			this.log('wake_up')
			this.triggerWakedUp.trigger(this)
		} else if (number == 7007) {
			this.log('shake')
			this.triggerShaked.trigger(this)
		} else if (number == 7008) {
			this.log('drop')
			this.triggerDropped.trigger(this)
		} else if ([1001, 2002, 3003, 4004, 5005, 6006].includes(number)) {
			this.log('double tapped')
			this.triggerDoubleTapped.trigger(this)
		} else if (number % 1000 == 0) {
			this.log('push')
			this.triggerPushed.trigger(this)
		} else if (fourthDigit == Math.abs(7 - firstDigit) && secondDigit == 0 && thirdDigit == 0) {
			this.log('flip180')
			this.triggerFlipped180.trigger(this)
		} else if (fourthDigit != Math.abs(7 - firstDigit) && secondDigit == 0 && thirdDigit == 0) {
			this.log('flip90')
			this.triggerFlipped90.trigger(this)
		} else {
			this.log('rotated', number)
			this.triggerRotated.trigger(this, {degrees: number})
		}
	}
	
	setTriggers() {
		this.triggerDoubleTapped = new Homey.FlowCardTriggerDevice('double_tap').register()
		this.triggerPushed = new Homey.FlowCardTriggerDevice('push').register()
		this.triggerWakedUp = new Homey.FlowCardTriggerDevice('wake_up').register()
		this.triggerShaked = new Homey.FlowCardTriggerDevice('shake').register()
		this.triggerDropped = new Homey.FlowCardTriggerDevice('drop').register()
		this.triggerRotated = new Homey.FlowCardTriggerDevice('rotate').register()
		this.triggerFlipped90 = new Homey.FlowCardTriggerDevice('flip90').register()
		this.triggerFlipped180 = new Homey.FlowCardTriggerDevice('flip180').register()
	}
	
}

module.exports = Cube