import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from "prop-types";
import { LinearGradient } from 'expo';
import { SkypeIndicator } from 'react-native-indicators';

export default class RoundButton extends React.Component {
	render() {
		return (
			<TouchableOpacity style={this.props.style} onPress={() => this.props.onPress()}>
				{
					this.props.theme == 'theme2'
						? <View style={[this.props.floatSize ? styles.theme2FloatContainer : styles.theme2Container]}>
							{
								this.props.isLoading
									? <View style={{ width: '100%', height: '100%' }}><SkypeIndicator color='white' size={25} /></View>
									: <Text style={styles.buttonTheme2Text}>{this.props.title}</Text>
							}
						</View>

						: <LinearGradient
							colors={['#ee9148', '#ee9148', '#ee9148']}
							style={[this.props.floatSize ? styles.floatContainer : styles.container]}>

							{
								this.props.isLoading
									? <View style={{ width: '100%', height: '100%' }}><SkypeIndicator color='white' size={25} /></View>
									: <Text style={styles.buttonText}>{this.props.title}</Text>
							}

						</LinearGradient>
				}

			</TouchableOpacity>
		);
	}
}

RoundButton.propTypes = {
	title: PropTypes.string,
	theme: PropTypes.string,
	floatSize: PropTypes.bool,
	isLoading: PropTypes.bool,
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 60,
		paddingRight: 60,
		borderRadius: 0,
		shadowColor: '#888',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 3,
		height: 34,
		paddingTop: 20,
		paddingBottom: 20,

	},

	floatContainer: {
		padding: 10,
		alignItems: 'center',
		borderRadius: 0,
		shadowColor: '#888',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 3,
		height: 42,
	},

	theme2Container: {
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 10,
		paddingBottom: 10,
		borderRadius: 0,
		borderColor: '#ee9148',
		borderWidth: 2,
	},

	theme2FloatContainer: {
		padding: 10,
		alignItems: 'center',
		borderRadius: 24,
		borderColor: '#028b67',
		borderWidth: 1,
	},

	buttonText: {
		fontFamily: 'opensans-regular',
		color: 'white',
		textTransform: 'uppercase',
		fontSize: 16,
	},

	buttonTheme2Text: {
		fontFamily: 'opensans-regular',
		color: '#ee9148',
		textTransform: 'uppercase',
		fontSize: 16,
	},
});