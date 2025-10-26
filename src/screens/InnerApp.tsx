import React, {useEffect, useState} from 'react';
import {View, StatusBar, Platform, Text, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Utils} from '@Utils';
import {fontFamily, fontSize} from '@constants';
import Toast, {toastConfig} from 'components/showFlashMessage';
import {AysncStorageHelper} from '@AsyncStoreHelper';
import LoginScreen from './LoginScreen/LoginScreen';
import AddressBookScreen from './AddressBookScreen/AddressBookScreen';
import FavouritesScreen from './FavouritesScreen/FavouritesScreen';
import ProfileScreen from './ProfileScreen/ProfileScreen';
import color from '@color';
import LinearGradient from 'react-native-linear-gradient';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs config
const TABS = [
  {name: 'Contacts', component: AddressBookScreen, icon: 'book'},
  {name: 'Favourites', component: FavouritesScreen, icon: 'heart'},
  {name: 'Profile', component: ProfileScreen, icon: 'account'},
];

// Custom Bottom Tab
function CustomBottomTab({state, descriptors, navigation}: any) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#ff9a9e', '#fad0c4']}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={{
        flexDirection: 'row',
        height: Platform.OS === 'android' ? 60 : 80,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: {width: 0, height: -2},
        shadowRadius: 5,
        borderTopColor: color.greyLine,
        borderTopWidth: 1,
      }}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const tab: any = TABS.find(t => t.name === route.name);

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{justifyContent: 'center', alignItems: 'center'}}
            activeOpacity={0.7}>
            <Icon
              name={tab.icon}
              size={24}
              color={isFocused ? '#e91e63' : '#555'}
            />
            <Text
              style={{
                color: isFocused ? '#e91e63' : '#555',
                fontSize: fontSize.fontSize_10,
                fontFamily: fontFamily.Medium,
                marginTop: 3,
              }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
}

// Bottom Tab Navigator
function BottomTabStack() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <CustomBottomTab {...props} />}>
      {TABS.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}

// User Home Stack
function UserHomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTabStack" component={BottomTabStack} />
      {/* Add more screens under User Home if needed */}
    </Stack.Navigator>
  );
}

// Login Stack
function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* Add signup/forgot password screens here if needed */}
    </Stack.Navigator>
  );
}

// Main App Navigator
function IneerApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AysncStorageHelper.UserData()
      .then(res => {
        Utils.loggedInUser = res;
        setUser(res);
        setTimeout(() => SplashScreen.hide(), 1000);
      })
      .catch(() => {
        setTimeout(() => SplashScreen.hide(), 1000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}} edges={['left', 'right', 'bottom']}>
        <StatusBar backgroundColor={color.themeWhite} barStyle="dark-content" />
        <Stack.Navigator
          initialRouteName={Utils.loggedInUser ? 'UserHomeStack' : 'LoginStack'}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="LoginStack" component={LoginStack} />
          <Stack.Screen name="UserHomeStack" component={UserHomeStack} />
        </Stack.Navigator>
      </SafeAreaView>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default IneerApp;
