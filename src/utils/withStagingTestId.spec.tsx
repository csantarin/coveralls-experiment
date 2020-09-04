import 'react-native';
import '@testing-library/jest-native/extend-expect';
import React, { Component, FunctionComponent, memo, PureComponent } from 'react';
import { Text, TextProps, View } from 'react-native';
import { render, cleanup } from '@testing-library/react-native';

import { withStagingTestId, getTestNameByKeyFromProps, postProcessTestName } from './withStagingTestId';

const updateEvent = jest.fn();

describe('withStagingTestId', () => {
	afterEach(() => cleanup());

	describe('exported module', () => {
		it('should exist', () => {
			expect(withStagingTestId).toBeDefined();
			expect(getTestNameByKeyFromProps).toBeDefined();
			expect(postProcessTestName).toBeDefined();
		});
	});

	describe('utils', () => {
		it('should only generate testID when the key exists as a nonfalsy string', () => {
			expect(getTestNameByKeyFromProps({}, '')).toBeUndefined();
			expect(getTestNameByKeyFromProps({})).toBeUndefined();
			expect(getTestNameByKeyFromProps({})).toBeUndefined();
			expect(getTestNameByKeyFromProps({ value: 123 }, 'value'));
		});

		it('should return the raw string if no string postprocessing has been provided', () => {
			const props = { value: 'ABC' };
			const key: keyof typeof props = 'value';
			expect(getTestNameByKeyFromProps(props, key)).toBe('ABC');
			expect(getTestNameByKeyFromProps(props, key, postProcessTestName)).toBe('abc');
			expect(getTestNameByKeyFromProps(props, key, (testName) => testName + 'DEF')).toBe('ABCDEF');
		});
	});

	describe('injected props', () => {
		interface MockAppProps extends TextProps {
			mockValue?: string | null;
			otherProp?: string | null;
		}

		class MockApp extends Component<MockAppProps> {
			componentDidUpdate() {
				updateEvent();
			}

			render() {
				const {
					mockValue,
					...rest
				} = this.props;

				return (
					<View>
						<Text {...rest}>
							{mockValue}
						</Text>
					</View>
				);
			}
		}

		it('should generate testID & accessibilityLabel based on the selected testNameAttribute only', () => {
			const MockAppTagByMockValue = withStagingTestId(MockApp, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
			});

			const { getByText, rerender } = render(
				<MockAppTagByMockValue
					mockValue="Hello World"
				/>
			);
			const mockValueTextElement = getByText('Hello World');

			expect(mockValueTextElement).toHaveProp('children', 'Hello World');
			expect(mockValueTextElement).toHaveProp('testID', 'mock-HelloWorld');
			expect(mockValueTextElement).toHaveProp('accessibilityLabel', 'mock-HelloWorld');

			rerender(
				<MockAppTagByMockValue
					mockValue="Hi There"
				/>
			);

			expect(mockValueTextElement).toHaveProp('children', 'Hi There');
			expect(mockValueTextElement).toHaveProp('testID', 'mock-HiThere');
			expect(mockValueTextElement).toHaveProp('accessibilityLabel', 'mock-HiThere');
		});

		it('should not use the testNameAttribute to generate a testID if it points to an undefined prop value.', () => {
			// Print nothing on the <Text> element and expect to not use it because it's null.
			const MockAppTagByOtherProp = withStagingTestId(MockApp, {
				testComponentRole: 'mock',
				testNameAttribute: 'otherProp',
			});

			// Assume `otherProp` has not been defined. This should mean the resulting testID={undefined}.
			const { getByText, rerender } = render(
				<MockAppTagByOtherProp
					mockValue="Hello World"
				/>
			);
			const otherPropTextElement = getByText('Hello World');

			expect(otherPropTextElement).toHaveProp('children', 'Hello World');
			expect(otherPropTextElement).not.toHaveProp('testID', 'mock-HelloWorld');
			expect(otherPropTextElement).not.toHaveProp('accessibilityLabel', 'mock-HelloWorld');
			expect(otherPropTextElement.props.testID).toBeUndefined();

			rerender(
				<MockAppTagByOtherProp
					mockValue="Hi There"
				/>
			);

			expect(otherPropTextElement).toHaveProp('children', 'Hi There');
			expect(otherPropTextElement).not.toHaveProp('testID', 'mock-HiThere');
			expect(otherPropTextElement).not.toHaveProp('accessibilityLabel', 'mock-HiThere');
			expect(otherPropTextElement.props.testID).toBeUndefined();
		});

		it('should not use the testNameAttribute to generate a testID if it points to a null prop value.', () => {
			// Print nothing on the <Text> element and expect to not use it because it's null.
			const MockAppTagByNullMockValue = withStagingTestId(MockApp, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
			});

			const { UNSAFE_getByProps: getByProps, rerender } = render(
				<MockAppTagByNullMockValue
					mockValue={null}
				/>
			);
			const nullMockValueElement = getByProps({ children: null });

			expect(nullMockValueElement.props.children).toBeNull();
			expect(nullMockValueElement).not.toHaveProp('testID', 'mock-HelloWorld');
			expect(nullMockValueElement).not.toHaveProp('accessibilityLabel', 'mock-HelloWorld');

			rerender(
				<MockAppTagByNullMockValue
					mockValue={null}
					otherProp="Hi There"
				/>
			);

			expect(nullMockValueElement.props.children).toBeNull();
			expect(nullMockValueElement).not.toHaveProp('testID', 'mock-HiThere');
			expect(nullMockValueElement).not.toHaveProp('accessibilityLabel', 'mock-HiThere');
		});

		// Print `testID` because the consumer has already provided it.
		it('should not use the testNameAttribute to generate a testID if a testID has already been declared', () => {
			const MockAppTagByTestIdOverride = withStagingTestId(MockApp, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
			});

			const { getByText, rerender } = render(
				<MockAppTagByTestIdOverride
					mockValue="Hello World"
					testID="MockElement:MyOwnTestId"
					accessibilityLabel="MockElement:MyOwnAccessibilityLabel"
				/>
			);
			const mockValueTextElement = getByText('Hello World');

			expect(mockValueTextElement).toHaveProp('children', 'Hello World');
			expect(mockValueTextElement).toHaveProp('testID', 'MockElement:MyOwnTestId');
			expect(mockValueTextElement).toHaveProp('accessibilityLabel', 'MockElement:MyOwnAccessibilityLabel');

			const { UNSAFE_getByProps: getByProps } = render(
				<MockAppTagByTestIdOverride
					mockValue={null}
					testID="MockElement:MyOwnTestId"
					accessibilityLabel="MockElement:MyOwnAccessibilityLabel"
				/>
			);
			const nullMockValueElement = getByProps({ children: null });

			expect(nullMockValueElement.props.children).toBeNull();
			expect(nullMockValueElement).toHaveProp('testID', 'MockElement:MyOwnTestId');
			expect(nullMockValueElement).toHaveProp('accessibilityLabel', 'MockElement:MyOwnAccessibilityLabel');

			rerender(
				<MockAppTagByTestIdOverride
					mockValue="Hi There"
					testID="MockElement:MyOwnTestId2"
					accessibilityLabel="MockElement:MyOwnAccessibilityLabel2"
				/>
			);

			expect(mockValueTextElement).toHaveProp('children', 'Hi There');
			expect(mockValueTextElement).toHaveProp('testID', 'MockElement:MyOwnTestId2');
			expect(mockValueTextElement).toHaveProp('accessibilityLabel', 'MockElement:MyOwnAccessibilityLabel2');
		});
	});

	describe('wrapped component', () => {
		interface MockAppProps extends TextProps {
			mockValue?: string | null;
			otherProp?: string | null;
		}

		const MockAppTemplate: FunctionComponent<MockAppProps> = (props: MockAppProps) => {
			const {
				mockValue,
				...rest
			} = props;

			return (
				<View>
					<Text {...rest}>
						{mockValue}
					</Text>
				</View>
			)
		};

		it('should be rerendered upon every received update in React.Component', () => {
			const renderEvent = jest.fn();

			class MockAppClass extends Component<MockAppProps> {
				render() {
					renderEvent();

					return (
						<MockAppTemplate {...this.props} />
					);
				}
			}

			const MockAppClassTagged = withStagingTestId(MockAppClass, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
			});

			const { rerender } = render(<MockAppClassTagged mockValue="Hello World" />);

			rerender(<MockAppClassTagged mockValue="Hello World" />);
			rerender(<MockAppClassTagged mockValue="Hello World" />);
			rerender(<MockAppClassTagged mockValue="Hello World" />);

			expect(renderEvent).toHaveBeenCalledTimes(4);
		});

		it('should be rerendered upon every received update in React.FunctionComponent', () => {
			const renderEvent = jest.fn();
	
			const MockAppFunction: React.FunctionComponent<MockAppProps> = (props) => {
				renderEvent();
	
				return (
					<MockAppTemplate {...props} />
				);
			};
	
			const MockAppTagged = withStagingTestId(MockAppFunction, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
			});

			const { rerender } = render(<MockAppTagged mockValue="Hello World" />);

			rerender(<MockAppTagged mockValue="Hello World" />);
			rerender(<MockAppTagged mockValue="Hello World" />);
			rerender(<MockAppTagged mockValue="Hello World" />);

			expect(renderEvent).toHaveBeenCalledTimes(4);
		});

		it('should not be rerendered upon every received update if the prev and next props are shallowly equal in React.PureComponent', () => {
			const renderPureClassEvent = jest.fn();

			class PureMockAppClass extends PureComponent<MockAppProps> {
				render() {
					renderPureClassEvent();

					return (
						<MockAppTemplate {...this.props} />
					);
				}
			}

			const PureMockAppClassTagged = withStagingTestId(PureMockAppClass, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
			});

			const { rerender } = render(<PureMockAppClassTagged mockValue="Hello World" />);

			rerender(<PureMockAppClassTagged mockValue="Hello World" />);
			rerender(<PureMockAppClassTagged mockValue="Hello World" />);
			rerender(<PureMockAppClassTagged mockValue="Hello World" />);

			expect(renderPureClassEvent).toHaveBeenCalledTimes(1);
		});

		it('should not be rerendered upon every received update if the prev and next props are shallowly equal in React.memo(React.FunctionComponent)', () => {
			const renderPureFunctionEvent = jest.fn();
	
			const PureMockAppFunction = memo(function PureMockApp(props: MockAppProps) {
				renderPureFunctionEvent();
	
				return (
					<MockAppTemplate {...props} />
				);
			});
	
			const PureMockAppFunctionTagged = withStagingTestId(PureMockAppFunction, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
			});
	
			const { rerender } = render(<PureMockAppFunctionTagged mockValue="Hello World" />);
	
			rerender(<PureMockAppFunctionTagged mockValue="Hello World" />);
			rerender(<PureMockAppFunctionTagged mockValue="Hello World" />);
			rerender(<PureMockAppFunctionTagged mockValue="Hello World" />);
	
			expect(renderPureFunctionEvent).toHaveBeenCalledTimes(1);
		});

		it('should make available all of a class component\'s static methods', () => {
			class MockAppClass extends Component<MockAppProps> {
				public static mockMethod1 = jest.fn();
				public static mockMethod2 = jest.fn();
				public static mockMethod3 = jest.fn();

				public render() {
					return (
						<MockAppTemplate {...this.props} />
					);
				}
			}

			const MockAppClassTagged = withStagingTestId(MockAppClass, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
			});

			expect(MockAppClassTagged.mockMethod1).toBeDefined();
			expect(MockAppClassTagged.mockMethod2).toBeDefined();
			expect(MockAppClassTagged.mockMethod3).toBeDefined();

			MockAppClassTagged.mockMethod1();
			expect(MockAppClassTagged.mockMethod1).toHaveBeenCalledTimes(1);

			MockAppClassTagged.mockMethod2();
			expect(MockAppClassTagged.mockMethod2).toHaveBeenCalledTimes(1);

			MockAppClassTagged.mockMethod3();
			expect(MockAppClassTagged.mockMethod3).toHaveBeenCalledTimes(1);
		});

		it('should make available all of a function component\'s static methods', () => {
			function MockAppFunction(props: MockAppProps) {
				return (
					<MockAppTemplate {...props} />
				);
			}

			MockAppFunction.mockMethod1 = jest.fn();
			MockAppFunction.mockMethod2 = jest.fn();
			MockAppFunction.mockMethod3 = jest.fn();

			const MockAppClassTagged = withStagingTestId(MockAppFunction, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
			});

			expect(MockAppClassTagged.mockMethod1).toBeDefined();
			expect(MockAppClassTagged.mockMethod2).toBeDefined();
			expect(MockAppClassTagged.mockMethod3).toBeDefined();

			MockAppClassTagged.mockMethod1();
			expect(MockAppClassTagged.mockMethod1).toHaveBeenCalledTimes(1);

			MockAppClassTagged.mockMethod2();
			expect(MockAppClassTagged.mockMethod2).toHaveBeenCalledTimes(1);

			MockAppClassTagged.mockMethod3();
			expect(MockAppClassTagged.mockMethod3).toHaveBeenCalledTimes(1);
		});
	});
});
