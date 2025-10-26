import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import BaseWrapper from 'components/Base';
import {Utils} from '@Utils';
import {fontFamily, fontSize} from '@constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Navigator from '@Navigator';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  phone?: string;
}

const ProfileScreen = ({navigation}: any) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const loggedInUser = Utils.loggedInUser;
        if (loggedInUser) setUser(loggedInUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            Utils.loggedInUser = undefined;
            await AsyncStorage.clear();
            Navigator.resetStackScreen(navigation, 'LoginStack');
          } catch (error) {
            console.error('Error clearing storage', error);
          }
        },
      },
    ]);
  };

  const infoRows = useMemo(
    () => [
      {label: 'Username', value: user?.username ?? 'N/A'},
      {label: 'Gender', value: user?.gender ?? 'N/A'},
      {label: 'Email', value: user?.email ?? 'N/A'},
      {label: 'Phone', value: user?.phone ?? 'N/A'},
    ],
    [user],
  );

  const ProfileInfoRow = ({label, value}: {label: string; value: string}) => (
    <>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      <View style={styles.separator} />
    </>
  );

  return (
    <BaseWrapper
      fullScreenMode
      linearGrad
      linearColor={['#ff9a9e', '#fad0c4']}
      linearStart={{x: 0, y: 0}}
      linearEnd={{x: 0, y: 1}}
      container_style={{flex: 1}}>
      <LinearGradient
        colors={['#ff9a9e', '#fad0c4']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <LinearGradient
            colors={['#5f2c82', '#49a09d']}
            style={styles.profileCard}>
            <View style={styles.avatarBorder}>
              <Image
                source={{
                  uri: user?.image || 'https://i.pravatar.cc/150?img=12',
                }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.name}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
          </LinearGradient>

          {/* Profile Info Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Profile Info</Text>
            {infoRows.map((row, idx) => (
              <ProfileInfoRow key={idx} label={row.label} value={row.value} />
            ))}
          </View>
        </ScrollView>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7} style={styles.logoutWrapper}>
          <LinearGradient
            colors={['#ff6a88', '#ff99ac']}
            style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </BaseWrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {
    padding: Utils.calculateWidth(16),
    paddingBottom: Utils.calculateHeight(40),
  },
  profileCard: {
    alignItems: 'center',
    padding: Utils.calculateWidth(28),
    borderRadius: Utils.calculateWidth(20),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
    elevation: 6,
    marginBottom: Utils.calculateHeight(20),
  },
  avatarBorder: {
    borderRadius: Utils.calculateWidth(60),
    padding: 3,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: Utils.calculateHeight(12),
  },
  avatar: {
    width: Utils.calculateWidth(120),
    height: Utils.calculateWidth(120),
    borderRadius: Utils.calculateWidth(60),
  },
  name: {
    fontFamily: fontFamily.Bold,
    fontSize: fontSize.fontSize_24,
    color: '#fff',
  },
  email: {
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.fontSize_14,
    color: '#e0e0e0',
    marginTop: Utils.calculateHeight(4),
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: Utils.calculateWidth(24),
    padding: Utils.calculateWidth(24),
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 16,
    elevation: 6,
    marginBottom: Utils.calculateHeight(20),
  },
  sectionTitle: {
    fontFamily: fontFamily.Bold,
    fontSize: fontSize.fontSize_18,
    color: '#5f2c82',
    marginBottom: Utils.calculateHeight(16),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Utils.calculateHeight(12),
  },
  infoLabel: {
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.fontSize_14,
    color: '#888',
  },
  infoValue: {
    fontFamily: fontFamily.Bold,
    fontSize: fontSize.fontSize_16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: Utils.calculateHeight(2),
  },
  logoutWrapper: {margin: Utils.calculateWidth(15)},
  logoutButton: {
    paddingVertical: Utils.calculateHeight(16),
    borderRadius: Utils.calculateWidth(14),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontFamily: fontFamily.Bold,
    fontSize: fontSize.fontSize_16,
  },
});
