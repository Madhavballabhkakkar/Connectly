// import I18n from 'react-native-i18n';
import {Keyboard, View} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import LoadingView from './loadingView';

export class Utils {
  static isLive = true;
  static loggedInUser;

  static dismissKeyword() {
    Keyboard.dismiss();
  }

  static showLoading(isLoading) {
    return isLoading ? (
      <LoadingView style={{}} isLoading={isLoading} />
    ) : (
      <View />
    );
  }

  static calculateWidth(componentWidth) {
    //375 is the screen width which we used to create design of the app
    return Math.round(responsiveWidth((100 / 372) * componentWidth));
  }

  static calculateHeight(componentWidth) {
    //375 is the screen width which we used to create design of the app
    return Math.round(responsiveWidth((100 / 380) * componentWidth));
  }
}
