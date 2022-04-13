const Block = require("./block");
const cryptoHash = require('./crypto-hash');
const { GENESIS_DATA, MINE_RATE } = require('./config');

describe('Block', () => {
	const timestamp = 2000;
	const lastHash = 'foo-hash';
	const hash = 'bar-hash';
	const nonce = 0;
	const difficulty = 1;
	const data = ['blockchain', 'data'];

	const block = new Block({
		timestamp: timestamp, 
		lastHash: lastHash, 
		hash: hash,
		nonce: nonce,
		difficulty: difficulty,
		data: data});

	it('has a timestamp, lastHash, hash and data property', () => {
		expect(block.timestamp).toEqual(timestamp);
		expect(block.lastHash).toEqual(lastHash);
		expect(block.hash).toEqual(hash);
		expect(block.data).toEqual(data);
	});

	describe('genesis()', () => {
		const genesisBlock = Block.genesis();

		it('returns a block istance', () => {
			expect(genesisBlock instanceof Block).toBe(true);
		});

		it('returns the genesis data', () => {
			expect(genesisBlock).toEqual(GENESIS_DATA);
		});
	});

	describe('mineBlock()', () => {
		const lastBlock = Block.genesis();
		const data = 'mined data';
		const minedBlock = Block.mineBlock({ lastBlock, data });

		it('return a Block instance', () => {
			expect(minedBlock instanceof Block).toBe(true);
		});

		it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
			expect(minedBlock.lastHash).toEqual(lastBlock.hash);
		});

		it('sets the `data`', () => {
			expect(minedBlock.data).toEqual(data);
		});

		it('sets a `timestamp`', () => {
			expect(minedBlock.timestamp).not.toEqual(undefined);
		});

		it('creates a SHA-256 `hash` based on the proper inputs', () => {
			expect(minedBlock.hash)
				.toEqual(
					cryptoHash(
						minedBlock.timestamp, 
						lastBlock.hash, 
						data, 
						minedBlock.nonce, 
						minedBlock.difficulty
					)
				);
		});

		it('sets a `hash` that matches the difficulty criteria', () => {
			expect(minedBlock.hash.substring(0, minedBlock.difficulty))
				.toEqual('0'.repeat(minedBlock.difficulty));
		});
	});

	describe('adjustDifficulty', () => {
		it('raises the difficulty for a quickly mined block', () => {
			expect(Block.adjustDifficulty({ 
				originalBlock: block ,
				timestamp: block.timestamp + MINE_RATE - 100
			})).toEqual(block.difficulty+1);
		});

		it('lowers the difficulty for a slowly mined block', () => {
			expect(Block.adjustDifficulty({
				originalBlock: block,
				timestamp: block.timestamp + MINE_RATE +100
			})).toEqual(block.difficulty-1);
		});
	});
});