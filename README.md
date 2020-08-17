# With Staging `testID` higher-order component proof-of-concept

## Overview

This source code demonstrates:

1. using a higher-order component (HOC) to wrap an existing component implementation in order to generate **default** `testID` and `accessibilityLabel` props for automated testing in staging environments only.
2. that by using that HOC, there should be little adjustment required in order to make use of it.

> ℹ [!NOTE]
>
> This source code uses `react-native` & `react-native-web` for demonstration & testing purposes. `hoist-non-react-statics` is also required for components which have static methods.
>
> Additional tooling to make native testing work:
> - `@testing-library/jest-native`
> - `@testing-library/react-native`
> - `react-test-renderer`

## Premise

We could implement `withStagingTestId(WrappedComponent, options)` such that additional props to generate the default `testID` and `accessibilityLabel` on staging is abstracted from the actual component, thus reducing prop pollution:


**TitleTextFunction.tsx**
```tsx
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Text, TextProps } from 'react-native';

import { withStagingTestId } from 'utils/withStagingTestId';

export interface TitleTextFunctionProps extends TextProps {
	title?: string;
}

export interface TitleTextFunctionHandle {
	doSomething: () => void;
	forceUpdate: (callback?: () => void) => void;
}

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
```

**App.tsx**

```tsx
import React from 'react';
import TitleTextFunctionTagged from './TitleTextFunctionTagged';

export const App = () => {
	// In here, details such as `testComponentRole` and `testNameAttribute` are inaccessible, thus keeping the component props clean.
	return (
		<TitleTextFunctionTagged title="Hi!" />
	);
};
```

## Sources

- Writing HOCs in TS: https://react-typescript-cheatsheet.netlify.app/docs/hoc/react_hoc_docs

## Setup

1. Clone this repo to your local.
	```bash
	# https
	git clone https://github.com/csantarin/with-staging-testid-poc.git

	# ssh
	git clone git@github.com:csantarin/with-staging-testid-poc.git
	```

2. Browse to the local copy.
	```bash
	cd with-staging-testid-poc
	```

3. Install all dependencies.
	```bash
	yarn
	```

4. Run the app itself for a live demo.
	```bash
	yarn start
	```

	Expect all `TitleText*` elements to have a "span-<title>" `testID` and `accessibilityLabel`.

5. Run the tests.
	```bash
	yarn test
	```

	Expect 0 errors.

## Further instructions

See [the `create-react-app` docs template](docs/create-react-app/README.md).
