const redis = require('redis');

const CHANNELS = {
	TEST: 'TEST'
};

class PubSub {
	constructor() {
		this.publisher = redis.createClient();
		this.publisher.connect();
		this.publisher.ping();

		this.subscriber = redis.createClient();
		this.subscriber.connect();
		this.subscriber.ping();

		this.subscriber.subscribe(CHANNELS.TEST, (message, channelName) =>{
			console.info(`Message received. Channel: ${channelName}. Message: ${message}`);
		});
	}

	handleMessage(channel, message) {
		console.log(`Message recived. Channel: ${channel}. Message: ${message}.`);
	}
}

const testPubSub = new PubSub();
setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 1000);