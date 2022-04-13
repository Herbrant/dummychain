const GENESIS_DATA  = require('./config');
const cryptoHash = require('./crypto-hash');
class Block {
	constructor({ timestamp, lastHash, hash, nonce, difficulty, data}) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash =  hash;
		this.nonce = nonce;
		this.difficulty = difficulty;
		this.data = data;
	}

	static genesis(){
		return new this(GENESIS_DATA);
	}

	static mineBlock({ lastBlock, data }){
		let hash, timestamp; 
		const lastHash = lastBlock.hash;
		const difficulty = lastBlock.difficulty;
		let nonce = 0;

		do {
			nonce++;
			timestamp = Date.now();
			hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)
		} while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));

		return new this({ timestamp, lastHash, data, difficulty, nonce, hash });
	}
}

module.exports = Block;