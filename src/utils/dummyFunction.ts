export const dummyFunction = (value: number = 0, asString: boolean = false) => {
	return asString ? value.toString() : value;
};
