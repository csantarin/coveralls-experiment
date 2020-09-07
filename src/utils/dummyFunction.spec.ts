import { dummyFunction } from './dummyFunction';

describe('dummyFunction', () => {
	it('should exist', () => {
		expect(dummyFunction).toBeDefined();
	});

	it('should generate an empty string', () => {
		expect(dummyFunction()).toBe('');
	});
});
