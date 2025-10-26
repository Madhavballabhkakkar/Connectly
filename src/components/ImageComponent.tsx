import React from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import FastImage from 'react-native-fast-image';

interface Props {
  source: any;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  childData?: boolean;
  parentSource?: string;
  parentStyle?: ViewStyle;
  onClickImage?: any;
  children?: React.ReactNode;
  tintColor?: string;
}

const ImageComponent: React.FC<Props> = props => {
  const {
    source,
    style,
    resizeMode = 'contain',
    onClickImage,
    tintColor,
    children,
  } = props;

  return (
    <View>
      {/* <Image
        source={source}
        style={[style, {tintColor}]} // Applied tintColor here
        resizeMode={resizeMode}
        onTouchEnd={onClickImage} // Added onClickImage for handling image clicks
      />
      {children} */}

      <FastImage
        resizeMode={resizeMode ?? 'contain'}
        source={source}
        style={[style, {}]}
        tintColor={tintColor}
        onTouchEnd={onClickImage}
        
        >
        {children}
      </FastImage>
    </View>
  );
};

const itemPropsAreEqual = (prevProps: Props, nextProps: Props) => {
  return (
    prevProps.source === nextProps.source &&
    prevProps.style === nextProps.style &&
    prevProps.resizeMode === nextProps.resizeMode &&
    prevProps.tintColor === nextProps.tintColor &&
    prevProps.children === nextProps.children &&
    prevProps?.onClickImage === nextProps?.onClickImage
  );
};

export default React.memo(ImageComponent, itemPropsAreEqual);

const styles = StyleSheet.create({});
