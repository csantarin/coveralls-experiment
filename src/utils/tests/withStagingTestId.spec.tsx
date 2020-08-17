import 'react-native';
import React, { Component, FunctionComponent, memo, PureComponent } from 'react';
import { Text, TextProps, View } from 'react-native';
import { render, cleanup } from '@testing-library/react-native';

import withStagingTestId from '../withStagingTestId';

const updateEvent = jest.fn();

describe('withStagingTestId', () => {
	afterEach(() => cleanup());

	describe('exported module', () => {
		it('should exist', () => {
			expect(withStagingTestId).toBeDefined();
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

		it('should only rerender wrapped React.Component / React.FunctionComponent when the props have been changed', () => {
			const updateEvent = jest.fn();
			const renderEvent = jest.fn();

			class MockApp extends Component<MockAppProps> {
				componentDidUpdate() {
					updateEvent();
				}

				render() {
					renderEvent();

					return (
						<MockAppTemplate {...this.props} />
					);
				}
			}

			class PureMockApp extends PureComponent<MockAppProps> {
				componentDidUpdate() {
					updateEvent();
				}

				render() {
					renderEvent();

					return (
						<MockAppTemplate {...this.props} />
					);
				}
			}

			const MockAppTagged = withStagingTestId(MockApp, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
				pure: true,
			});

			const rendered = render(<MockAppTagged mockValue="Hello World" />);

			rendered.update(<MockAppTagged mockValue="Hello World" />);
			rendered.update(<MockAppTagged mockValue="Hello World" />);
			rendered.update(<MockAppTagged mockValue="Hello World" />);
			expect(updateEvent).toHaveBeenCalledTimes(0);
		});

		it('should only rerender wrapped React.PureComponent / React.memo when the props have been changed', () => {
			const updateEvent = jest.fn();
			const renderEvent = jest.fn();

			class MockApp extends Component<MockAppProps> {
				componentDidUpdate() {
					updateEvent();
				}

				render() {
					renderEvent();

					return (
						<MockAppTemplate {...this.props} />
					);
				}
			}

			class PureMockApp extends PureComponent<MockAppProps> {
				componentDidUpdate() {
					updateEvent();
				}

				render() {
					renderEvent();

					return (
						<MockAppTemplate {...this.props} />
					);
				}
			}

			const MockAppTagged = withStagingTestId(PureMockApp, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
				pure: true,
			});

			const rendered = render(<MockAppTagged mockValue="Hello World" />);

			rendered.rerender(<MockAppTagged mockValue="Hello World" />);
			rendered.rerender(<MockAppTagged mockValue="Hello World" />);
			rendered.rerender(<MockAppTagged mockValue="Hello World" />);
			expect(updateEvent).toHaveBeenCalledTimes(0);
		});

		it('2', () => {
			const updateEvent = jest.fn();
			const renderEvent = jest.fn();

			class MockApp extends Component<MockAppProps> {
				componentDidUpdate() {
					updateEvent();
				}

				render() {
					renderEvent();

					return (
						<MockAppTemplate {...this.props} />
					);
				}
			}

			class PureMockApp extends PureComponent<MockAppProps> {
				componentDidUpdate() {
					updateEvent();
				}

				render() {
					renderEvent();

					return (
						<MockAppTemplate {...this.props} />
					);
				}
			}

			const MockAppTagged = withStagingTestId(PureMockApp, {
				testComponentRole: 'mock',
				testNameAttribute: 'mockValue',
			});

			const PureMockAppTagged = memo(MockAppTagged);

			const rendered = render(<PureMockAppTagged mockValue="Hello World" />);

			rendered.rerender(<PureMockAppTagged mockValue="Hello World" />);
			rendered.rerender(<PureMockAppTagged mockValue="Hello World" />);
			rendered.rerender(<PureMockAppTagged mockValue="Hello World" />);
			expect(updateEvent).toHaveBeenCalledTimes(0);
			expect(renderEvent).toHaveBeenCalledTimes(1);
		});
	});
});
