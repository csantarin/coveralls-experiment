import React from 'react';
import { ViewProps, AccessibilityProps } from 'react-native';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { generateStagingTestId } from './generateStagingTestId';

const getComponentDisplayName = (WrappedComponent: React.ComponentType<any>) => {
	return (
		WrappedComponent.displayName ||
		WrappedComponent.name ||
		'Component'
	);
};

const getSecondaryTestIdFromProps = <P extends {}>(props: P, key?: keyof P | (string & {})) => {
	if (!key || !key.toString().trim().length) {
		return;
	}

	const value = (props as any)[key];

	if (typeof value !== 'string') {
		return;
	}

	return value;
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
	/**
	 * Annotates the type of element in its `testID` during staging testing.
	 *
	 * Used with another attribute such as `title` to produce `"<role>-<title>"` when either of the missing props is missing:
	 * - `testID`
	 * - `accessibilityLabel`
	 */
	testComponentRole?: string;
}

interface StagingTestIdInternalProps<T> {
	stagingTestIdForwardedRef?: RefObject<T>;
}

interface StagingTestIdOptions<P> extends StagingTestIdProps {
	testNameAttribute?: keyof P | (string & {});
	forwardRef?: boolean;
	pure?: boolean;
	getDisplayName?: (componentName: string) => string;
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
	const Component = component;
	const componentName = getComponentDisplayName(Component);
	const {
		pure,
		forwardRef,
		getDisplayName = (componentName: string) => `WithStagingTestId(${componentName})`,
	} = options;

	const displayName = getDisplayName(componentName);

	// const StagingTestIdFunction: FunctionComponent<P & StagingTestIdProps & StagingTestIdInternalProps<T>> = (props) => {
	function StagingTestIdFunction(props: P & StagingTestIdProps & StagingTestIdInternalProps<T>) {
		const {
			stagingTestIdForwardedRef,
			testComponentRole = options.testComponentRole,
			testID: _testID,
			accessibilityLabel: _accessibilityLabel,
			...rest
		} = props;

		const secondaryTestID = getSecondaryTestIdFromProps(rest as P, options.testNameAttribute);
		const testID = generateStagingTestId(_testID, secondaryTestID, testComponentRole);
		const accessibilityLabel = generateStagingTestId(_accessibilityLabel, secondaryTestID, testComponentRole);

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
	const StagingTestIdMaybeMemoizedWithRef = !forwardRef
		? StagingTestIdMaybeMemoized
		: React.forwardRef<T, P>(function forwardStagingTestIdRef(props, ref) {
			return (
				// @ts-ignore
				<StagingTestIdMaybeMemoized
					{...props}
					stagingTestIdForwardedRef={ref}
				/>
			);
		});

	(StagingTestIdMaybeMemoizedWithRef as React.ComponentType<P>).displayName = displayName;

	// Copy all of the wrapped component's static methods to the wrapper so that they can
	// be accessed by consumers just as the wrapped component had originally intended to.
	const StagingTestId = hoistNonReactStatics(StagingTestIdMaybeMemoizedWithRef, Component);
	(StagingTestId as React.ComponentType<P>).displayName = displayName;

	return StagingTestId as any as C;
};

export default withStagingTestId;
