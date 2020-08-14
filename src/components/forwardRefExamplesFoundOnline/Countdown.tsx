// We have some solid work here.
// https://stackoverflow.com/questions/62210286/declare-type-with-react-useimperativehandle
import React, { forwardRef, useImperativeHandle } from 'react';

/**
 * Countdown component API.
 */
export interface CountdownHandle {
	start: () => void;
}

export interface CountdownProps extends React.PropsWithChildren<{}> {
	/**
	 * Number of seconds to count down from.
	 */
	seconds?: number;
}

/**
 * A Countdown function component.
 * 
 * Accepts `ref` which exposes a `CountdownHandle` imperative API.
 */
export const Countdown = forwardRef<CountdownHandle, CountdownProps>((
	props,
	ref,
) => {
	const { children } = props;

	// Expose internal functions.
	useImperativeHandle(ref, (): CountdownHandle => ({
		start() {
			console.log('Start');
		},
	}));

	return (
		<div>
			{children}
		</div>
	);
});

export default Countdown;
