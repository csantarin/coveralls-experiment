import React from 'react';
import { Text, TextProps } from 'react-native';

import withStagingTestId from '../utils/withStagingTestId';

export interface TitleTextFunctionProps extends TextProps {
	title?: string;
}

export const TitleTextFunctionWithoutRef = (props: TitleTextFunctionProps) => {
	const {
		title,
		...rest
	} = props;

	return (
		<Text {...rest}>
			{title}
		</Text>
	);
};

export const TitleTextFunctionWithoutRefTagged = withStagingTestId(TitleTextFunctionWithoutRef, {
	testComponentRole: 'span',
	testNameAttribute: 'id',
});
