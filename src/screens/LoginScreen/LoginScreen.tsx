import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Utils} from '@Utils';
import {fontFamily, fontSize} from '@constants';
import Navigator from '@Navigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AysncStorageHelper} from '@AsyncStoreHelper';
import BaseWrapper from 'components/Base';
import color from '@color';
import {loginUserAPI} from '@redux/actions';
import {showFlashMessage} from 'components/showFlashMessage';

const LoginScreen = ({navigation}: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) return showFlashMessage('Please enter your username');
    if (!password.trim()) return showFlashMessage('Please enter your password');

    try {
      const user = await loginUserAPI({username, password: password.trim()});
      if (user) {
        await AysncStorageHelper.setUserData(user);
        Navigator.resetStackScreen(navigation, 'UserHomeStack');
      }
    } catch (err: any) {
      showFlashMessage(err.message || 'Login failed');
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    icon,
  }: any) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={`Enter your ${label.toLowerCase()}`}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          autoCapitalize="none"
        />
        {icon && (
          <TouchableOpacity onPress={icon.onPress}>
            {icon.component}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <BaseWrapper
      fullScreenMode
      linearGrad
      linearColor={['#ff9a9e', '#fad0c4']}
      topViewBackgroundColor="#ff9a9e">
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue</Text>

            <InputField
              label="Username"
              value={username}
              onChangeText={text => setUsername(text.trim())}
            />

            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              icon={{
                onPress: () => setShowPassword(prev => !prev),
                component: (
                  <Icon
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={24}
                    color="#999"
                  />
                ),
              }}
            />

            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.8}
              style={{marginTop: Utils.calculateHeight(30)}}>
              <LinearGradient
                colors={['#ff6a88', '#ff99ac']}
                style={styles.loginBtn}>
                <Text style={styles.loginBtnText}>LOGIN</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BaseWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  scrollContent: {
    padding: Utils.calculateWidth(24),
    paddingTop: Utils.calculateHeight(100),
    paddingBottom: Utils.calculateHeight(40),
  },
  title: {
    fontSize: fontSize.fontSize_32,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginBottom: Utils.calculateHeight(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.fontSize_16,
    fontFamily: fontFamily.Medium,
    color: '#555',
    marginBottom: Utils.calculateHeight(40),
    textAlign: 'center',
  },
  inputWrapper: {marginBottom: Utils.calculateHeight(20)},
  label: {
    fontSize: fontSize.fontSize_14,
    fontFamily: fontFamily.Medium,
    color: '#333',
    marginBottom: Utils.calculateHeight(8),
    marginLeft: Utils.calculateWidth(4),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: Utils.calculateWidth(14),
    paddingHorizontal: Utils.calculateWidth(20),
    height: Utils.calculateHeight(55),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: fontSize.fontSize_14,
    fontFamily: fontFamily.Book,
    color: '#000',
  },
  loginBtn: {
    height: Utils.calculateHeight(55),
    borderRadius: Utils.calculateWidth(14),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 3,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: fontSize.fontSize_18,
    fontFamily: fontFamily.Bold,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Utils.calculateHeight(24),
  },
  signupText: {
    color: '#555',
    fontFamily: fontFamily.Book,
    fontSize: fontSize.fontSize_14,
  },
  signupLink: {
    color: '#5f2c82',
    fontFamily: fontFamily.Bold,
    fontSize: fontSize.fontSize_14,
  },
});
