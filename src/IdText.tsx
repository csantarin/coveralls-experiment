import React from 'react';
import { Text, TextProps } from 'react-native';

type TextPropsReduced = Omit<TextProps, 'children'>;

export interface IdTextProps extends TextPropsReduced {
	id?: string;
}

export const IdText = (props: IdTextProps) => {
	const {
		id,
		...rest
	} = props;

	return (
		<Text {...rest}>
			{id}
		</Text>
	);
};
