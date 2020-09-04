import React, { Component } from 'react';
import { Text, TextProps } from 'react-native';

import withStagingTestId from '../utils/withStagingTestId';

export interface TitleTextProps extends TextProps {
	title?: string;
}

export class TitleTextClass extends Component<TitleTextProps> {
	doSomething() {
		console.log('(imperative) %c<TitleTextClass />', 'color: #8824ff', 'Did something.');
	}

	render() {
		const {
			title,
			...rest
		} = this.props;
	
		return (
			<Text {...rest}>
				{title}
			</Text>
		);
	}
}

export const TitleTextClassTagged = withStagingTestId(TitleTextClass, {
	testComponentRole: 'span',
	testNameAttribute: 'id',
});
