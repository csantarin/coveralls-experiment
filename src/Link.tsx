import React, { FunctionComponent } from "react";
import { StyleSheet, Text, TextProps } from 'react-native';

type TextPropsReduced = Omit<TextProps, 'accessibilityRole'>;

export interface LinkProps extends TextPropsReduced {
	href?: string;
}

export const Link: FunctionComponent<LinkProps> = (props) => {
	return (
		<Text
			{...props}
			accessibilityRole="link"
			style={StyleSheet.compose(
				styles.link,
				props.style as any
			)}
		/>
	);
};

export const styles = StyleSheet.create({
	link: {
		color: "#1B95E0"
	},
});

export default Link;
