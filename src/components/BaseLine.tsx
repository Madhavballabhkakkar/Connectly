// components/BaseLine.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import color from '@color';
import { Utils } from '@Utils';

interface Props {
  style?: ViewStyle;
}

const BaseLine: React.FC<Props> = ({ style }) => {
  return <View style={[styles.line, style]} />;
};

const styles = StyleSheet.create({
  line: {
    backgroundColor: color.greyLine,
    height: Utils.calculateWidth(1),
    marginVertical: Utils.calculateHeight(16),
  },
});

export default BaseLine;
