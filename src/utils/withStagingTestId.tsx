import React from 'react';
import { ViewProps, AccessibilityProps } from 'react-native';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { isBeta } from '../lib/constants';
import generateTestId from './generateTestId';
import getComponentDisplayName from './getComponentDisplayName';

const isStaging = () => {
	return __DEV__ || isBeta;
};

export const getTestNameByKeyFromProps = <P extends {}>(props: P, key?: keyof P | (string & {}), postProcess?: (testName: string) => string) => {
	if (!key || !key.toString().trim().length) {
		return;
	}

	const value = (props as any)[key as string];

	if (typeof value !== 'string') {
		return;
	}

	if (typeof postProcess !== 'function') {
		return value;
	}

	return postProcess(value);
};

export const postProcessTestName = (value: string) => {
	return value.toLowerCase();
};

type RefObject<T> = ((instance: T | null) => void) | React.MutableRefObject<T | null> | null;

type StagingTestIdProps =
	& Pick<AccessibilityProps, 'accessibilityLabel'>
	& Pick<ViewProps, 'testID'>;

interface StagingTestIdInternalProps<T> {
	stagingTestIdForwardedRef?: RefObject<T>;
}

interface StagingTestIdOptions<P> {
	/**
	 * Prefixes the element's default `testID` with a type during staging testing, e.g. `'button'`, `'textInput'`.
	 *
	 * Used with the attribute described in `testNameAttribute` to produce `"<role>-<title>"` when either of the missing props is missing:
	 * - `testID`
	 * - `accessibilityLabel`
	 */
	testComponentRole?: string | null;
	/**
	 * Attribute to use for the name segment of the **default** `testID` when an external `testID` override has not been provided.
	 *
	 * Used with the attribute described in `testNameAttribute` to produce `"<role>-<title>"` when either of the missing props is missing:
	 * - `testID`
	 * - `accessibilityLabel`
	 */
	testNameAttribute?: keyof P | (string & {});
}

/**
 * Wraps a component with a default `testID` and `accessibilityLabel` using a preferred name attribute from wrapper component's props in staging environments only.
 * This wrapper will not be applied to production.
 *
 * The resulting format of the default `testID` and `accessibilityLabel` is determined in the order specified in [`generateTestId()`](./generateTestId.ts).
 *
 * 	- `primaryId` = a user-defined `testID`
 * 	- `secondaryId` = an alternate prop which would be used to create part of the default `testID`
 * 	- `elementRole` = a prefix to set the default `testID` with
 *
 * Possible results, in this order of precedence:
 * 1. trimmed `"primaryId"` is nonempty.
 * 2. trimmed `"elementRole-secondaryId"` if `elementRole` and `secondaryId` are nonempty.
 * 3. trimmed `"secondaryId"` if `secondaryId` is nonempty but `elementRole` is empty.
 * 4. `undefined` if both `primaryId` and `secondaryId` are empty.
 *
 * @param Component The component to enhance with the staging testID algorithm.
 * @param options Additional options to the staging testID component enhancement.
 * @example
 *
 * import React from 'react';
 * import { View, Text, TextInput, TextInputProps } from 'react-native';
 * import withStagingTestId from './withStagingTestId';
 *
 * interface MyTextInputProps extends TextInputProps {
 * 	label?: string;
 * }
 *
 * // Components applying the class-based approach should
 * // be exported also for the sake of React ref typings.
 * export class MyTextInput extends React.Component<MyTextInputProps> {
 * 	render() {
 * 		const { label, ...rest, testID, accessibilityLabel } = this.props;
 * 		return (
 * 			<View>
 * 				<Text>{label}</Text>
 * 				<TextInput
 * 					{...rest}
 * 					// If user-defined `testID` and `accessibilityLabel`
 * 					// have been provided, they will be used instead.
 * 					testID={testID}
 * 					accessibilityLabel={accessibilityLabel}
 * 				/>
 * 			</View>
 * 		);
 * 	}
 * }
 *
 * // Consumers are expected to use this.
 * export default withStagingTestId(MyTextInput, {
 * 	testComponentRole: 'textInput',	// Any role you prefer.
 * 	testNameAttribute: 'label',		// This prop key will be picked up by IntelliSense.
 * });
 */
export const withStagingTestId = <
	C extends React.JSXElementConstructor<{}>, // Infer component type from here.
	P extends React.ComponentProps<C> = React.ComponentProps<C>,
>(
	WrappedComponent: C,
	options: StagingTestIdOptions<P> = {},
) => {
	// Don't run wrapping at all if the staging doesn't apply.
	/* istanbul ignore next */
	if (!isStaging()) {
		return WrappedComponent;
	}

	const {
		testComponentRole,
		testNameAttribute,
	} = options;
	const componentName = getComponentDisplayName(WrappedComponent);
	const displayName = `WithStagingTestId(${componentName})`;

	// Infer props from component.
	// https://react-typescript-cheatsheet.netlify.app/docs/hoc/react_hoc_docs/
	type Props = JSX.LibraryManagedAttributes<C, P>;
	const Component = WrappedComponent as React.JSXElementConstructor<P>;
	const StagingTestIdFunction: React.FunctionComponent<Props & StagingTestIdProps & StagingTestIdInternalProps<C>> = (props) => {
		const {
			stagingTestIdForwardedRef,
			testID: primaryTestID,
			accessibilityLabel: primaryAccessibilityLabel,
			...rest
		} = props;

		const testName = getTestNameByKeyFromProps(props, testNameAttribute, postProcessTestName);
		const testID = generateTestId(primaryTestID, testName, testComponentRole);
		const accessibilityLabel = generateTestId(primaryAccessibilityLabel, testName, testComponentRole);

		return (
			<Component
				{...rest as Props}
				testID={testID}
				accessibilityLabel={accessibilityLabel}
				ref={stagingTestIdForwardedRef}
			/>
		);
	};

	StagingTestIdFunction.displayName = displayName;

	// Forward the ref passed to the wrapper down to the wrapped component using a regular
	// "forwardedRef" prop reserved specifically for the wrapper, if required.
	const StagingTestIdWithRef = React.forwardRef<C, Props>(function forwardStagingTestIdRef(props, ref) {
		return (
			<StagingTestIdFunction
				{...props}
				stagingTestIdForwardedRef={ref}
			/>
		);
	});

	StagingTestIdWithRef.displayName = displayName;

	// Copy all of the wrapped component's static methods to the wrapper so that they can
	// be accessed by consumers just as the wrapped component had originally intended to.
	const StagingTestId = hoistNonReactStatics(StagingTestIdWithRef, WrappedComponent);
	StagingTestIdWithRef.displayName = displayName;

	return StagingTestId as any as C;
};

export default withStagingTestId;
