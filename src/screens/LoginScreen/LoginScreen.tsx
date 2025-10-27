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

  const gradientColors = useMemo(() => ['#ff9a9e', '#fad0c4'], []);

  const handleLogin = async () => {
    if (!username.trim()) return showFlashMessage('Please enter your username');
    if (!password.trim()) return showFlashMessage('Please enter your password');

    try {
      const user = await loginUserAPI({
        username: username.trim(),
        password: password.trim(),
      });
      if (user) {
        await AysncStorageHelper.setUserData(user);
        Navigator.resetStackScreen(navigation, 'UserHomeStack');
      }
    } catch (err: any) {
      showFlashMessage(err.message || 'Login failed');
    }
  };

  return (
    <BaseWrapper
      fullScreenMode
      linearGrad
      linearColor={gradientColors}
      topViewBackgroundColor="#ff9a9e">
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to continue</Text>

              {/* Username Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Enter your username"
                    placeholderTextColor="#888"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="default"
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    autoCapitalize="none"
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(prev => !prev)}>
                    <Icon
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={24}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
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
          </View>
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
});
