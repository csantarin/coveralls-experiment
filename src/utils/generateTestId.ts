/**
 * Generates a test identifier.
 *
 * Returned values:
 *
 * 1. trimmed `"primaryId"` is nonempty.
 * 2. trimmed `"elementRole-secondaryId"` if `elementRole` and `secondaryId` are nonempty.
 * 3. trimmed `"secondaryId"` if `secondaryId` is nonempty but `elementRole` is empty.
 * 4. `undefined` if both `primaryId` and `secondaryId` are empty.
 *
 * @param {string | null} [primaryId=''] A name used as the primary means of identifying the element. Takes precedence when not empty.
 * @param {string | null} [secondaryId=''] Alternate identifier name.
 * @param {string | null} [elementRole=''] Element role.
 * @returns {string | undefined} See **Returned values**.
 */
const generateTestId = (
	primaryId: string | null = '',
	secondaryId: string | null = '',
	elementRole: string | null = '',
): string | undefined => {
	// Return nonempty primaryId.
	if (typeof primaryId === 'string' && primaryId.trim().length) {
		return primaryId.replace(/ /g, '');
	}

	// The primaryId value is no longer useful here.
	// Switching to secondaryId...

	// Return undefined when secondaryId is empty.
	if (!secondaryId || !secondaryId.trim().length) {
		return;
	}

	// Formulate string such that elementRole + secondaryId must be hyphenated and that they have values on both sides.
	// If there's only a secondaryId value, return the secondaryId only.
	const testId = [
		elementRole || '',
		secondaryId,
	]
		.map((value) => value.replace(/ /g, ''))
		.filter((value): value is string => Boolean(value))
		.join('-') || undefined;

	return testId;
};

export default generateTestId;
