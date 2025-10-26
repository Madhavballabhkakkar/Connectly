import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import BaseWrapper from 'components/Base';
import {Utils} from '@Utils';
import {fontFamily, fontSize} from '@constants';
import {AysncStorageHelper} from '@AsyncStoreHelper';
import {useFocusEffect} from '@react-navigation/native';
import CardItem from 'screens/AddressBookScreen/components/CartItem';
import {getUserCartsAPI} from '@redux/actions';

const FavouritesScreen = () => {
  const [favourites, setFavourites] = useState<number[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // fade animations
  const fadeAnimRefs = useRef<{[key: number]: Animated.Value}>({}).current;

  // Helper to get/create Animated.Value
  const getFadeAnim = useCallback((id: number) => {
    if (!fadeAnimRefs[id]) fadeAnimRefs[id] = new Animated.Value(1);
    return fadeAnimRefs[id];
  }, []);

  // Load favourites + users
  const loadFavouritesAndUsers = useCallback(async () => {
    setLoading(true);
    try {
      const rawFavIds = (await AysncStorageHelper.getFavourites()) ?? [];
      const favIds = rawFavIds
        .map((x: any) => Number(x))
        .filter(n => !isNaN(n));
      setFavourites(favIds);

      const response = await getUserCartsAPI({limit: 0});
      const usersData = response?.users ?? [];
      const mappedUsers = usersData.map((user: any) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        university: user.university,
        image: user.image,
        raw: user,
      }));
      setAllUsers(mappedUsers);

      // initialize animations for favourites
      favIds.forEach(id => getFadeAnim(id).setValue(1));
    } catch (e) {
      console.log('Error fetching users/favourites:', e);
    } finally {
      setLoading(false);
    }
  }, [getFadeAnim]);

  useFocusEffect(
    useCallback(() => {
      loadFavouritesAndUsers();
    }, [loadFavouritesAndUsers]),
  );

  // derived favourites
  const favUsers = React.useMemo(() => {
    return allUsers.filter(u => favourites.includes(u.id));
  }, [allUsers, favourites]);

  // Toggle favourite
  const handleToggleFavourite = useCallback(
    async (userId: number) => {
      const isFav = favourites.includes(userId);
      const fadeAnim = getFadeAnim(userId);

      if (isFav) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }).start(async () => {
          const updatedFavsRaw = await AysncStorageHelper.toggleFavourite(
            userId,
          );
          const updatedFavs = (updatedFavsRaw ?? [])
            .map((x: any) => Number(x))
            .filter(n => !isNaN(n));
          setFavourites(updatedFavs);
        });
      } else {
        // add immediately
        const updatedFavsRaw = await AysncStorageHelper.toggleFavourite(userId);
        const updatedFavs = (updatedFavsRaw ?? [])
          .map((x: any) => Number(x))
          .filter(n => !isNaN(n));
        setFavourites(updatedFavs);

        if (!fadeAnimRefs[userId]) fadeAnimRefs[userId] = new Animated.Value(0);
        Animated.timing(fadeAnimRefs[userId], {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }).start();
      }
    },
    [favourites, getFadeAnim],
  );

  // Memoized renderItem
  const renderItem = useCallback(
    ({item}: {item: any}) => {
      const anim = getFadeAnim(item.id);

      return (
        <Animated.View
          style={{
            opacity: anim,
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.97, 1],
                }),
              },
            ],
          }}>
          <CardItem
            user={item}
            isFavourite={favourites.includes(item.id)}
            onToggleFavourite={handleToggleFavourite}
          />
        </Animated.View>
      );
    },
    [favourites, handleToggleFavourite, getFadeAnim],
  );

  return (
    <BaseWrapper
      fullScreenMode
      linearGrad
      linearColor={['#ff9a9e', '#fad0c4']}
      container_style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.header}>❤️ Favourites</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{marginTop: 40}}
          />
        ) : favUsers.length === 0 ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>No favourites yet</Text>
          </View>
        ) : (
          <FlatList
            data={favUsers}
            keyExtractor={item => `${item.id}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: Utils.calculateHeight(40)}}
          />
        )}
      </View>
    </BaseWrapper>
  );
};

export default FavouritesScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: Utils.calculateWidth(16)},
  header: {
    fontSize: fontSize.fontSize_22,
    fontFamily: fontFamily.Bold,
    color: '#000',
    marginBottom: Utils.calculateHeight(16),
  },
  emptyView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: {
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.fontSize_16,
    color: '#777',
  },
});
