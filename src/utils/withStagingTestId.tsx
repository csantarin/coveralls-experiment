import React from 'react';
import { ViewProps, AccessibilityProps } from 'react-native';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { generateTestId } from './generateStagingTestId';
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

type ComponentType<P> = 
	| React.ComponentType<P>
	| ((props: P) => React.ReactElement<any>)
	| ((props: P) => JSX.Element);

type StagingTestIdPropsBase = 
	& Pick<AccessibilityProps, 'accessibilityLabel'>
	& Pick<ViewProps, 'testID'>;

interface StagingTestIdProps extends StagingTestIdPropsBase {
}

interface StagingTestIdInternalProps<T> {
	stagingTestIdForwardedRef?: RefObject<T>;
}

interface StagingTestIdOptions<P> extends StagingTestIdProps {
	/**
	 * Prefixes the element's default `testID` with a type during staging testing, e.g. `'button'`, `'textInput'`.
	 *
	 * Used with the attribute as described in `testNameAttribute` to produce `"<role>-<title>"` when either of the missing props is missing:
	 * - `testID`
	 * - `accessibilityLabel`
	 */
	testComponentRole?: string | null;
	/**
	 * Attribute to use as the name segment of the **default** `testID` when an external `testID` override has not been provided.
	 *
	 * Used with the attribute as described in `testNameAttribute` to produce `"<role>-<title>"` when either of the missing props is missing:
	 * - `testID`
	 * - `accessibilityLabel`
	 */
	testNameAttribute?: keyof P | (string & {});
	pure?: boolean;
}

/**
 * Wraps a component with a default `testID` and `accessibilityLabel` using a preferred name attribute from wrapper component's props.
 *
 * @param Component The component to enhance with the staging testID algorithm.
 * @param options Additional options to the staging testID component enhancement.
 */
export const withStagingTestId = <
	P extends {},
	T extends {},
	C extends ComponentType<P>,
>(
	component: C | ComponentType<P & StagingTestIdProps> | React.ForwardRefExoticComponent<P & React.RefAttributes<T>>,
	options: StagingTestIdOptions<P> = {},
) => {
	if (!isStaging()) {
		return component;
	}

	const Component = component;
	const componentName = getComponentDisplayName(Component);
	const {
		pure,
		testComponentRole,
		testNameAttribute,
	} = options;

	const displayName = `WithStagingTestId(${componentName})`;

	// const StagingTestIdFunction: FunctionComponent<P & StagingTestIdProps & StagingTestIdInternalProps<T>> = (props) => {
	function StagingTestIdFunction(props: P & StagingTestIdProps & StagingTestIdInternalProps<T>) {
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
			<Component
				{...rest as P}
				testID={testID}
				accessibilityLabel={accessibilityLabel}
				ref={stagingTestIdForwardedRef}
			/>
		);
	};

	// Use memoization if required.
	const StagingTestIdMaybeMemoized = !pure
		? StagingTestIdFunction
		: React.memo(StagingTestIdFunction);


	(StagingTestIdMaybeMemoized as React.ComponentType<P>).displayName = displayName;

	// Forward the ref passed to the wrapper down to the wrapped component using a regular
	// "forwardedRef" prop reserved specifically for the wrapper, if required.
	const StagingTestIdMaybeMemoizedWithRef = React.forwardRef<T, P>(function forwardStagingTestIdRef(props, ref) {
		return (
			// @ts-ignore
			<StagingTestIdMaybeMemoized
				{...props}
				stagingTestIdForwardedRef={ref}
			/>
		);
	});

	StagingTestIdMaybeMemoizedWithRef.displayName = displayName;

	// Copy all of the wrapped component's static methods to the wrapper so that they can
	// be accessed by consumers just as the wrapped component had originally intended to.
	const StagingTestId = hoistNonReactStatics(StagingTestIdMaybeMemoizedWithRef, Component);
	StagingTestIdMaybeMemoizedWithRef.displayName = displayName;

	return StagingTestId as any as C;
};

export default withStagingTestId;
