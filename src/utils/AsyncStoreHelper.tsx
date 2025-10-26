import AsyncStorage from '@react-native-async-storage/async-storage';
import {Utils} from '@Utils';

const USER_DATA = 'userData';
const FAVOURITES_KEY = 'userFavourites';
const SIGNUP_PROGRESS_KEY = 'SIGNUP_PROGRESS';

export class AysncStorageHelper {
  static setUserData(user: any) {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(USER_DATA, JSON.stringify(user))
        .then(() => {
          Utils.loggedInUser = user;
          resolve(undefined);
        })
        .catch(err => reject(new Error('err' + err)));
    });
  }

  static UserData() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(USER_DATA)
        .then(user => {
          try {
            if (user) {
              resolve(JSON.parse(user));
            } else reject(new Error('data not found!'));
          } catch (err) {
            reject(new Error('Error' + err));
          }
        })
        .catch(err => reject(new Error('Error' + err)));
    });
  }

  // ✅ Save favourites
  static async setFavourites(favIds: number[]) {
    try {
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(favIds));
    } catch (error) {
      console.error('Error saving favourites', error);
    }
  }

  // ✅ Get favourites
  static async getFavourites(): Promise<number[]> {
    try {
      const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading favourites', error);
      return [];
    }
  }

  // ✅ Toggle a single favourite user
  static async toggleFavourite(userId: number): Promise<number[]> {
    try {
      const currentFavs = await this.getFavourites();
      let updatedFavs: number[];

      if (currentFavs.includes(userId)) {
        updatedFavs = currentFavs.filter(id => id !== userId);
      } else {
        updatedFavs = [...currentFavs, userId];
      }

      await this.setFavourites(updatedFavs);
      return updatedFavs;
    } catch (error) {
      console.error('Error toggling favourite', error);
      return [];
    }
  }
}
