import generateStagingTestId from '../generateStagingTestId';

describe('generateStagingTestId', () => {
	it('should exist', () => {
		expect(generateStagingTestId).toBeDefined();
	});

	it('should return the trimmed primaryId when primaryId is not empty', () => {
		const nonemptyPrimaryIdResult = generateStagingTestId('primaryId', '', '');
		expect(nonemptyPrimaryIdResult).toBe('primaryId');

		const nonemptyWhitespacedPrimaryIdResult = generateStagingTestId('      primary        Id     ', '', '');
		expect(nonemptyWhitespacedPrimaryIdResult).toBe('primaryId');

		const emptyPrimaryIdResult = generateStagingTestId('', '', '');
		expect(emptyPrimaryIdResult).not.toBe('primaryId');

		const undefinedPrimaryIdResult = generateStagingTestId(undefined, '', '');
		expect(undefinedPrimaryIdResult).not.toBe('primaryId');
	});

	it('should return the trimmed elementRole-secondaryId joined string when primaryId is empty while elementRole and secondaryId are not empty', () => {
		const emptyPrimaryResult = generateStagingTestId('', 'secondaryId', 'button');
		expect(emptyPrimaryResult).toBe('button-secondaryId');

		const whitespacedPrimaryResult = generateStagingTestId('              ', 'secondaryId', 'button');
		expect(whitespacedPrimaryResult).toBe('button-secondaryId');

		const undefinedPrimaryResult = generateStagingTestId(undefined, 'secondaryId', 'button');
		expect(undefinedPrimaryResult).toBe('button-secondaryId');

		const nonemptyWhitespacedElementRoleSecondaryIdResult = generateStagingTestId(undefined, '      secondary   Id     ', '     bu tto n    ');
		expect(nonemptyWhitespacedElementRoleSecondaryIdResult).toBe('button-secondaryId');

		const notElementRoleSecondaryId = generateStagingTestId('primaryId', 'secondaryId', 'button');
		expect(notElementRoleSecondaryId).not.toBe('button-secondaryId');
	});

	it('should return the trimmed secondaryId only when secondaryId is not empty but elementRole is empty', () => {
		const emptyElementRoleResult = generateStagingTestId(undefined, 'secondaryId', '');
		expect(emptyElementRoleResult).toBe('secondaryId');

		const whitespacedElementRoleResult = generateStagingTestId(undefined, 'secondaryId', '           ');
		expect(whitespacedElementRoleResult).toBe('secondaryId');

		const undefinedElementRoleResult = generateStagingTestId(undefined, 'secondaryId');
		expect(undefinedElementRoleResult).toBe('secondaryId');

		const nonemptyWhitespacedSecondaryIdResult = generateStagingTestId(undefined, '      secondary   Id     ');
		expect(nonemptyWhitespacedSecondaryIdResult).toBe('secondaryId');

		const hasElementRoleResult = generateStagingTestId(undefined, 'secondaryId', 'button');
		expect(hasElementRoleResult).not.toBe('secondaryId');
	});

	it('should return undefined when both primaryId and secondaryId are empty', () => {
		const maybeUndefined1 = generateStagingTestId();
		expect(maybeUndefined1).toBeUndefined();

		const maybeUndefined2 = generateStagingTestId(undefined, '');
		expect(maybeUndefined2).toBeUndefined();

		const maybeUndefined3 = generateStagingTestId('');
		expect(maybeUndefined3).toBeUndefined();

		const maybeUndefined4 = generateStagingTestId('', '');
		expect(maybeUndefined4).toBeUndefined();

		const maybeUndefined5 = generateStagingTestId(undefined, undefined, 'button');
		expect(maybeUndefined5).toBeUndefined();

		const maybeUndefined6 = generateStagingTestId(undefined, '', 'button');
		expect(maybeUndefined6).toBeUndefined();

		const maybeUndefined7 = generateStagingTestId('', undefined, 'button');
		expect(maybeUndefined7).toBeUndefined();

		const maybeUndefined8 = generateStagingTestId('', '', 'button');
		expect(maybeUndefined8).toBeUndefined();
	});
});
