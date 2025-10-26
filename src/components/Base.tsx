import React from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TranslucentStatusBar from './TranslucentStatusBar';
import color from '@color';

export interface Props {
  container_style?: any;
  children?: React.ReactNode;
  backgroundColor?: string;
  fullScreenMode: boolean;
  linearGrad?: boolean;
  linearLocation?: number[];
  linearColor?: string[];
  linearStyle?: any;
  linearStart?: {x: number; y: number};
  linearEnd?: {x: number; y: number};
  topViewBackgroundColor?: any;
}

const BaseWrapper: React.FC<Props> = ({
  container_style,
  children,
  backgroundColor = color.themeWhite,
  fullScreenMode,
  linearGrad = false,
  linearLocation = [0, 0.5, 1],
  linearColor = [color.themeWhite, color.themeWhite],
  linearStyle = {},
  linearStart = {x: 0, y: 0},
  linearEnd = {x: 0, y: 1},
  topViewBackgroundColor,
}) => {
  const insets = useSafeAreaInsets();

  const edgeInsets: any = fullScreenMode
    ? ['left', 'right']
    : ['top', 'left', 'right', 'bottom'];

  const wrapperProps = {
    colors: linearColor,
    locations: linearLocation,
    start: linearStart,
    end: linearEnd,
    style: [StyleSheet.absoluteFill, linearStyle],
  };

  // Background is transparent if gradient is enabled
  const Content = (
    <View
      style={[
        styles.contentContainer,
        {backgroundColor: linearGrad ? 'transparent' : backgroundColor},
      ]}>
      <TranslucentStatusBar
        container_style={container_style}
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content">
        {fullScreenMode && (
          <View
            style={{
              backgroundColor: topViewBackgroundColor,
              paddingTop: insets.top,
            }}
          />
        )}
        {children}
      </TranslucentStatusBar>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {backgroundColor: linearGrad ? 'transparent' : backgroundColor},
      ]}
      edges={edgeInsets}>
      {linearGrad ? (
        <LinearGradient {...wrapperProps}>{Content}</LinearGradient>
      ) : (
        Content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
});

export default BaseWrapper;
