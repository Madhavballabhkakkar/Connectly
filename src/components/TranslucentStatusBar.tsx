import React from 'react';
import {StatusBar, View} from 'react-native';

interface Props {
  children: React.ReactNode;
  translucent: boolean;
  backgroundColor: any;
  barStyle: any;
  container_style?: any;
}

const TranslucentStatusBar: React.FC<Props> = ({
  children,
  translucent,
  backgroundColor,
  barStyle,
  container_style,
}) => {
  return (
    <View style={container_style || {flex: 1, width: '100%'}}>
      <StatusBar
        translucent={translucent}
        backgroundColor={backgroundColor}
        barStyle={barStyle} // or "dark-content"
      />
      {children}
    </View>
  );
};

export default TranslucentStatusBar;
