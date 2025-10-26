// components/FlashMessage.tsx

import color from '@color';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Toast, {BaseToastProps} from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info' | 'default';
type ToastPosition = 'top' | 'bottom';

// ✅ Reusable function to show toast
export const showFlashMessage = (
  message: string = 'Something went wrong',
  type: ToastType = 'default',
  position: ToastPosition = 'top',
  duration: number = 3000,
) => {
  message &&
    Toast.show({
      type: mapToastType(type),
      text1: message,
      position,
      visibilityTime: duration,
      autoHide: true,
      topOffset: 50,
      bottomOffset: 40,
    });
};

// ✅ Maps toast type to our custom keys
const mapToastType = (type: ToastType): 'common' => {
  return 'common'; // All types use the same UI
};

// ✅ Custom Toast component (common style)
const CommonToast = ({text1}: BaseToastProps) => {
  return (
    <View style={styles.toastContainer}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  );
};

// ✅ Export the config to plug into Toast
export const toastConfig = {
  common: (props: BaseToastProps) => <CommonToast {...props} />,
};

// ✅ Styles
const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor:'#ff6a88', // Common color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 16,
    elevation: 4,
    width: '90%',
  },
  toastText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Toast;
