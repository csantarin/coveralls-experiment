import { dummyFunction } from './dummyFunction';

describe('dummyFunction', () => {
	it('should exist', () => {
		expect(dummyFunction).toBeDefined();
	});

	it('should spit out the value according to the setting', () => {
		expect(dummyFunction(123)).toBe(123);
		expect(dummyFunction(123, undefined)).toBe(123);
		expect(dummyFunction(123, false)).toBe(123);
		expect(dummyFunction(123, true)).toBe('123');
	});
});
