import * as ReactNative from 'react-native';

// @see https://github.com/facebook/react-native/issues/26579#issuecomment-538610849
jest.doMock('react-native', () => {
	const handlers: { [key: string]: ReactNative.KeyboardEventListener; } = {};

	// Extend ReactNative
	return Object.setPrototypeOf(
		{
			Keyboard: {
				...ReactNative.Keyboard,
				emit: (name: ReactNative.KeyboardEventName, event: ReactNative.KeyboardEvent) => {
					if (!handlers[name]) {
						return;
					}
		
					handlers[name](event);
				},
				addListener(name: ReactNative.KeyboardEventName, listener: ReactNative.KeyboardEventListener) {
					handlers[name] = listener;
		
					return {
						remove() {
							delete handlers[name];
						},
					};
				},
				dismiss: jest.fn(),
			},
		},
		ReactNative,
	);
});
