const redis = require('redis');

const CHANNELS = {
	TEST: 'TEST',
	BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
	constructor( { blockchain }) {
		this.blockchain = blockchain;

		this.publisher = redis.createClient();
		this.publisher.connect();
		this.publisher.ping();

		this.subscriber = redis.createClient();
		this.subscriber.connect();
		this.subscriber.ping();

		this.subscribeToChannels();
	}

	handleMessage(message, channel) {
		console.log(`Message recived. Channel: ${channel}. Message: ${message}.`);

		const parsedMessage = JSON.parse(message);

		if (channel === CHANNELS.BLOCKCHAIN) {
			this.blockchain.replaceChain(parsedMessage);
		}
	}

	subscribeToChannels() {
		Object.values(CHANNELS).forEach(channel => {
			this.subscriber.subscribe(
				channel, 
				(message, channel) => this.handleMessage(message, channel)
			);
		});
	}

	publish({ channel, message }) {
		this.publisher.publish(channel, message);
	}

	broadcastChain() {
		this.publish({
			channel: CHANNELS.BLOCKCHAIN,
			message: JSON.stringify(this.blockchain.chain)
		});
	}
}

module.exports = PubSub;