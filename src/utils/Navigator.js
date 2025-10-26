import {AysncStorageHelper} from '@AsyncStoreHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {Utils} from '@Utils';

export default class Navigator {
  static setDashboardAsRoot(navigation, dashboardIndex) {
    navigation.dispatch(
      CommonActions.reset({
        index: dashboardIndex ?? 0, // This sets the index of the stack to 0, meaning the first screen
        key: null,
        routes: [
          {name: 'BottomTabStack'}, // This defines the route at the 0 position
        ],
      }),
    );
  }

  static setDashboardAsRootFromAppCategory(
    navigation,
    dashboardIndex,
    tabName,
  ) {
    navigation.dispatch(
      CommonActions.reset({
        index: dashboardIndex,
        key: null,
        routes: [
          {
            name: 'BottomTabStack',
            state: {
              routes: [{name: tabName}],
            },
          },
        ],
      }),
    );
  }

  static showUserStack(navigation) {
    navigation.dispatch(
      CommonActions.reset({
        index: 0, // This sets the index of the stack to 0, meaning the first screen
        key: null,
        routes: [
          {name: 'UserHomeStack'}, // This defines the route at the 0 position
        ],
      }),
    );
  }

  static replaceScreen(navigation, routeName, params) {
    navigation.replace(routeName, params);
  }
  static goToTab(navigation, tabName, routeName, params) {
    navigation.navigate(tabName, {
      screen: {name: routeName},
    });
  }

  static goBack(navigation) {
    navigation.goBack();
  }
  static pushScreen(navigation, routeName, params) {
    navigation.navigate(routeName, params);
  }

  ///goBackToScreen if screen already in exist stack (howManyScreenBack = pass number (how many screen back))
  static goBackToScreen(navigation, howManyScreenBack) {
    navigation.pop(howManyScreenBack);
  }

  static goToTopInStack(navigation) {
    navigation.popToTop();
  }

  static resetStackScreen(navigation, routeName, params) {
    navigation.dispatch(
      CommonActions.reset({
        index: 0, // This sets the index of the stack to 0, meaning the first screen
        key: null,
        routes: [
          {name: routeName, params: params}, // This defines the route at the 0 position
        ],
      }),
    );
  }

  static showModal(navigation, routeName, params) {
    navigation.navigate(routeName, params);
  }

  static showMessage(message, navigation, onViewed, subMessage) {
    let viewed = false;

    (data = {
      message: message,
      subMessage: subMessage,
      onViewed: () => {
        if (viewed) return;
        viewed = true;
        onViewed ? onViewed() : navigation.goBack();

        if (Utils.loggedInUser?.logout) {
          if (Utils.loggedInUser?.isRemember) {
            let data = {email: Utils.loggedInUser?.email};
            Utils.loggedInUser = undefined;
            AsyncStorage.clear();
            AysncStorageHelper.setUserData(data);
          } else {
            AsyncStorage.clear();
            Utils.loggedInUser = undefined;
          }
          navigation.dispatch(
            CommonActions.reset({
              index: 0, // This sets the index of the stack to 0, meaning the first screen
              key: null,
              routes: [
                {name: 'LoginStack', params: {}}, // This defines the route at the 0 position
              ],
            }),
          );
        }
      },
    }),
      navigation.navigate('MessageSheet', {data});
  }

  static dismissModal(navigation) {
    navigation.goBack();
  }
  static showDrawer(navigation) {
    navigation.openDrawer();
  }
  static hideDrawer() {
    navigation.closeDrawer();
    //props.navigation.closeDrawer();
  }
  static switchToRootTab(navigation, screenName, params) {
    navigation.navigate('BottomTabStack', {screen: screenName, params: params});
  }
}
