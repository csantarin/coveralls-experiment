import generateTestId from './generateTestId';

describe('generateStagingTestId', () => {
	it('should exist', () => {
		expect(generateTestId).toBeDefined();
	});

	it('should return the trimmed primaryId when primaryId is not empty', () => {
		const nonemptyPrimaryIdResult = generateTestId('primaryId', '', '');
		expect(nonemptyPrimaryIdResult).toBe('primaryId');

		const nonemptyWhitespacedPrimaryIdResult = generateTestId('      primary        Id     ', '', '');
		expect(nonemptyWhitespacedPrimaryIdResult).toBe('primaryId');

		const emptyPrimaryIdResult = generateTestId('', '', '');
		expect(emptyPrimaryIdResult).not.toBe('primaryId');

		const undefinedPrimaryIdResult = generateTestId(undefined, '', '');
		expect(undefinedPrimaryIdResult).not.toBe('primaryId');
	});

	it('should return the trimmed elementRole-secondaryId joined string when primaryId is empty while elementRole and secondaryId are not empty', () => {
		const emptyPrimaryResult = generateTestId('', 'secondaryId', 'button');
		expect(emptyPrimaryResult).toBe('button-secondaryId');

		const whitespacedPrimaryResult = generateTestId('              ', 'secondaryId', 'button');
		expect(whitespacedPrimaryResult).toBe('button-secondaryId');

		const undefinedPrimaryResult = generateTestId(undefined, 'secondaryId', 'button');
		expect(undefinedPrimaryResult).toBe('button-secondaryId');

		const nonemptyWhitespacedElementRoleSecondaryIdResult = generateTestId(undefined, '      secondary   Id     ', '     bu tto n    ');
		expect(nonemptyWhitespacedElementRoleSecondaryIdResult).toBe('button-secondaryId');

		const notElementRoleSecondaryId = generateTestId('primaryId', 'secondaryId', 'button');
		expect(notElementRoleSecondaryId).not.toBe('button-secondaryId');
	});

	it('should return the trimmed secondaryId only when secondaryId is not empty but elementRole is empty', () => {
		const emptyElementRoleResult = generateTestId(undefined, 'secondaryId', '');
		expect(emptyElementRoleResult).toBe('secondaryId');

		const whitespacedElementRoleResult = generateTestId(undefined, 'secondaryId', '           ');
		expect(whitespacedElementRoleResult).toBe('secondaryId');

		const undefinedElementRoleResult = generateTestId(undefined, 'secondaryId');
		expect(undefinedElementRoleResult).toBe('secondaryId');

		const nonemptyWhitespacedSecondaryIdResult = generateTestId(undefined, '      secondary   Id     ');
		expect(nonemptyWhitespacedSecondaryIdResult).toBe('secondaryId');

		const hasElementRoleResult = generateTestId(undefined, 'secondaryId', 'button');
		expect(hasElementRoleResult).not.toBe('secondaryId');
	});

	it('should return undefined when both primaryId and secondaryId are empty', () => {
		const maybeUndefined1 = generateTestId();
		expect(maybeUndefined1).toBeUndefined();

		const maybeUndefined2 = generateTestId(undefined, '');
		expect(maybeUndefined2).toBeUndefined();

		const maybeUndefined3 = generateTestId('');
		expect(maybeUndefined3).toBeUndefined();

		const maybeUndefined4 = generateTestId('', '');
		expect(maybeUndefined4).toBeUndefined();

		const maybeUndefined5 = generateTestId(undefined, undefined, 'button');
		expect(maybeUndefined5).toBeUndefined();

		const maybeUndefined6 = generateTestId(undefined, '', 'button');
		expect(maybeUndefined6).toBeUndefined();

		const maybeUndefined7 = generateTestId('', undefined, 'button');
		expect(maybeUndefined7).toBeUndefined();

		const maybeUndefined8 = generateTestId('', '', 'button');
		expect(maybeUndefined8).toBeUndefined();
	});
});
