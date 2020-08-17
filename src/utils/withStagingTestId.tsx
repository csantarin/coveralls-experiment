import React from 'react';
import { ViewProps, AccessibilityProps } from 'react-native';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { generateTestId } from './generateTestId';
import { isBeta, __DEV__ } from 'lib/constants';

const isStaging = () => {
	return __DEV__ || isBeta;
};

const getComponentDisplayName = (WrappedComponent: React.ComponentType<any>) => {
	return (
		WrappedComponent.displayName ||
		WrappedComponent.name ||
		'Component'
	);
};

const getTestNameByKeyFromProps = <P extends {}>(props: P, key?: keyof P | (string & {}), postProcess?: (testName: string) => string) => {
	if (!key || !key.toString().trim().length) {
		return;
	}

	const value = (props as any)[key];

	if (typeof value !== 'string') {
		return;
	}

	if (typeof postProcess !== 'function') {
		return value;
	}

	return postProcess(value);
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
 * Wraps a component with a default `testID` and `accessibilityLabel` using a preferred name attribute from wrapper component's props.
 *
 * @param Component The component to enhance with the staging testID algorithm.
 * @param options Additional options to the staging testID component enhancement.
 */
export const withStagingTestId = <
	P extends {},
	C extends {},
>(
	WrappedComponent: React.JSXElementConstructor<P> & C,
	options: StagingTestIdOptions<P> = {},
) => {
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
	const StagingTestIdFunction: React.FunctionComponent<Props & StagingTestIdProps & StagingTestIdInternalProps<C>> = (props) => {
		const {
			stagingTestIdForwardedRef,
			testID: primaryTestID,
			accessibilityLabel: primaryAccessibilityLabel,
			...rest
		} = props;

		const testName = getTestNameByKeyFromProps(props, testNameAttribute, (value) => {
			return value.toLowerCase();
		});
	
		const testID = generateTestId(primaryTestID, testName, testComponentRole);
		const accessibilityLabel = generateTestId(primaryAccessibilityLabel, testName, testComponentRole);

		return (
			<WrappedComponent
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
