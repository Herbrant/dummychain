const Block = require("./block");
const GENESIS_DATA = require('./config')

describe('Block', () => {
	const timestamp = 'a-date';
	const lastHash = 'foo-hash';
	const hash = 'bar-hash';
	const data = ['blockchain', 'data'];

	const block = new Block({timestamp, lastHash: lastHash, hash: hash, data: data});

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
		const mineBlock = Block.mineBlock({ lastBlock, data });

		it('return a Block instance', () => {
			expect(mineBlock instanceof Block).toBe(true);
		});

		it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
			expect(mineBlock.lastHash).toEqual(lastBlock.hash);
		});

		it('sets the `data`', () => {
			expect(mineBlock.data).toEqual(data);
		});

		it('sets a `timestamp`', () => {
			expect(mineBlock.timestamp).not.toEqual(undefined);
		});
	});
});