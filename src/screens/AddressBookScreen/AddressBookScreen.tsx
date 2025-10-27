import React, {useCallback, useState, useMemo} from 'react';
import {
  View,
  FlatList,
  StatusBar,
  Text,
  ActivityIndicator,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import BaseWrapper from 'components/Base';
import {Utils} from '@Utils';
import SearchBar from './components/SearchBar';
import CardItem from './components/CartItem';
import {AysncStorageHelper} from '@AsyncStoreHelper';
import {useFocusEffect} from '@react-navigation/native';
import {fontFamily, fontSize} from '@constants';
import {getUserCartsAPI} from '@redux/actions';
import {showFlashMessage} from 'components/showFlashMessage';
import color from '@color';

const FILTER_KEYS = [
  {label: 'First Name', value: 'firstName'},
  {label: 'Last Name', value: 'lastName'},
  {label: 'Email', value: 'email'},
  {label: 'Phone', value: 'phone'},
  {label: 'University', value: 'university'},
  {label: 'Hair Color', value: 'hair.color'},
  {label: 'Hair Type', value: 'hair.type'},
  {label: 'City', value: 'address.city'},
  {label: 'State', value: 'address.state'},
];

const AddressBookScreen = () => {
  const [search, setSearch] = useState('');
  const [favourites, setFavourites] = useState<number[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [filterVisible, setFilterVisible] = useState(false);
  const [filterKey, setFilterKey] = useState(FILTER_KEYS[0].value);
  const [filterValue, setFilterValue] = useState('');
  const [appliedFilter, setAppliedFilter] = useState({
    key: FILTER_KEYS[0].value,
    value: '',
  });

  useFocusEffect(
    useCallback(() => {
      loadFavourites();
      loadAllUsers();
    }, []),
  );

  const loadFavourites = async () => {
    const favIds = await AysncStorageHelper.getFavourites();
    setFavourites(favIds ?? []);
  };

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const response = await getUserCartsAPI({limit: 0});
      const mapped = (response?.users ?? []).map((u: any) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        phone: u.phone,
        university: u.university,
        image: u.image,
        raw: u,
      }));
      setUsers(mapped);
    } catch (e) {
      showFlashMessage('Failed to load users');
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavourite = async (id: number) => {
    const updated = await AysncStorageHelper.toggleFavourite(id);
    setFavourites(updated ?? []);
  };

  const getNestedValue = (obj: any, key: string) =>
    key.split('.').reduce((acc, part) => acc && acc[part], obj);

  const filteredUsers = useMemo(() => {
    let list = users;

    if (search) {
      list = list.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (appliedFilter.value) {
      list = list.filter(u =>
        getNestedValue(u.raw, appliedFilter.key)
          ?.toString()
          .toLowerCase()
          .includes(appliedFilter.value.toLowerCase()),
      );
    }

    return list;
  }, [users, search, appliedFilter]);

  const applyFilter = () => {
    const trimmedValue = filterValue.trim();
    if (!trimmedValue) return showFlashMessage('Please enter a value');

    setAppliedFilter({
      key: filterKey,
      value: trimmedValue,
    });
    setFilterVisible(false);
  };

  const renderItem = useCallback(
    ({item}: any) => (
      <CardItem
        user={item}
        isFavourite={favourites.includes(item.id)}
        onToggleFavourite={handleToggleFavourite}
      />
    ),
    [favourites],
  );

  return (
    <BaseWrapper
      fullScreenMode
      container_style={{flex: 1}}
      linearGrad
      linearColor={['#ff9a9e', '#fad0c4']}>
      <StatusBar barStyle="light-content" />
      <View style={{flex: 1, padding: Utils.calculateWidth(16)}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: Utils.calculateHeight(10),
          }}>
          <SearchBar value={search} onChangeText={setSearch} />
          <TouchableOpacity
            onPress={() => {
              setSearch('');
              if (appliedFilter.value) {
                // Clear filter if already applied
                setAppliedFilter({key: FILTER_KEYS[0].value, value: ''});
                setFilterKey(FILTER_KEYS[0].value);
                setFilterValue('');
              } else {
                // Otherwise open filter modal
                setFilterVisible(true);
              }
            }}
            style={styles.filterButton}>
            <Text style={styles.filterText}>
              {filterValue ? 'Clear' : 'Filter'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{marginTop: 40}}
          />
        ) : filteredUsers.length === 0 ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: Utils.calculateHeight(40)}}
          />
        )}

        <Modal
          transparent
          animationType="slide"
          visible={filterVisible}
          onRequestClose={() => setFilterVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Filter Users</Text>
              <ScrollView style={{maxHeight: 120}}>
                {FILTER_KEYS.map(f => (
                  <Pressable
                    key={f.value}
                    onPress={() => setFilterKey(f.value)}
                    style={{
                      padding: 10,
                      backgroundColor: filterKey === f.value ? '#000' : '#eee',
                      marginVertical: 4,
                      borderRadius: 8,
                    }}>
                    <Text
                      style={{
                        color: filterKey === f.value ? '#fff' : '#000',
                        fontFamily: fontFamily.Medium,
                      }}>
                      {f.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Enter value"
                value={filterValue}
                onChangeText={setFilterValue}
                placeholderTextColor={color.grey}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => setFilterVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.applyBtn} onPress={applyFilter}>
                  <Text style={styles.applyText}>Apply</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </BaseWrapper>
  );
};

export default AddressBookScreen;

const styles = StyleSheet.create({
  emptyView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: {
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.fontSize_16,
    color: '#777',
  },
  filterButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  filterText: {
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.fontSize_14,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontFamily: fontFamily.Bold,
    fontSize: fontSize.fontSize_18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    color: color.black,
  },
  cancelBtn: {padding: 10},
  applyBtn: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: {fontFamily: fontFamily.Medium, color: '#000'},
  applyText: {fontFamily: fontFamily.Medium, color: '#fff'},
});
