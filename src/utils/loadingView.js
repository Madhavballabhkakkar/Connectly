import color from '@color';
import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';

export default class LoadingView extends Component {
  static defaultProps = {
    loading: true,
    title: '',
    opacity: 0.1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {opacity, backgroundColor} = this.props;

    if (true) {
      return (
        <View
          style={[
            styles.overlay,
            {
              height: responsiveScreenHeight(100),
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              elevation: 5,
            },
          ]}>
          <View style={styles.overlay_div}>
            <View style={{width: 100, height: 100, borderRadius: 50}}>
              <ActivityIndicator
                size={'large'}
                loading={true}
                color={color.pink}
              />
            </View>
          </View>
        </View>
      );
    }
    return <View />;
  }
}

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1001,
  },
  overlay_div: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay_text: {
    textAlign: 'center',
  },
});
