import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Text, TextProps } from 'react-native';

import withStagingTestId from '../utils/withStagingTestId';

export interface TitleTextFunctionProps extends TextProps {
	title?: string;
}

export interface TitleTextFunctionHandle {
	doSomething: () => void;
	forceUpdate: (callback?: () => void) => void;
}

// NOTE:
// In a forwardRef, in order to see a displayName in DevTools, the function cannot be anonymous.
// Alternatively, explicitly name the component through the displayName static property.
// https://github.com/facebook/react/issues/13703#issuecomment-423346302
// https://reactjs.org/docs/forwarding-refs.html#displaying-a-custom-name-in-devtools
export const TitleTextFunction = forwardRef<TitleTextFunctionHandle, TitleTextFunctionProps>(function IdTextFunction(props, ref) {
	const {
		title,
		...rest
	} = props;

	const [ _, update ] = useState(0);
	useImperativeHandle(ref, (): TitleTextFunctionHandle => ({
		doSomething() {
			console.log('(imperative) %c<TitleTextFunction />', 'color: #ff5524', 'Did something.');
		},
		forceUpdate(callback) {
			update(_ + 1);

			if (!callback) {
				return;
			}

			callback();
		}
	}));

	return (
		<Text {...rest}>
			{title}
		</Text>
	);
});

export const TitleTextFunctionTagged = withStagingTestId(TitleTextFunction, {
	testComponentRole: 'span',
	testNameAttribute: 'id',
});

// Otherwise, we'd get just see "Component" in the React DevTools Component inspector.
(TitleTextFunctionTagged as React.FunctionComponent<{}>).displayName = 'TitleTextFunction';
