import React, {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Utils} from '@Utils';
import {fontFamily, fontSize} from '@constants';
import ImageComponent from 'components/ImageComponent';

interface Props {
  user: any;
  isFavourite?: boolean;
  onToggleFavourite?: (id: number) => void;
}

const CardItem: React.FC<Props> = React.memo(
  ({user, isFavourite = false, onToggleFavourite}) => {
    const [showDetails, setShowDetails] = useState(false);

    const otherDetails = useMemo(() => {
      const u = user.raw;
      return (
        <View>
          <Text style={styles.otherDetail}>
            <Text style={styles.bold}>Hair: </Text>
            {u.hair.color}, {u.hair.type}
          </Text>
          <Text style={styles.otherDetail}>
            <Text style={styles.bold}>Address: </Text>
            {u.address.address}, {u.address.city}, {u.address.state} -{' '}
            {u.address.postalCode}
          </Text>
          <Text style={styles.otherDetail}>
            <Text style={styles.bold}>Company: </Text>
            {u.company.name} ({u.company.title})
          </Text>
          <Text style={styles.otherDetail}>
            <Text style={styles.bold}>Bank: </Text>
            {u.bank.cardType} - {u.bank.cardNumber} ({u.bank.currency})
          </Text>
          <Text style={styles.otherDetail}>
            <Text style={styles.bold}>SSN: </Text>
            {u.ssn}
          </Text>
        </View>
      );
    }, [user.raw]);

    return (
      <LinearGradient
        colors={['#5f2c82', '#49a09d']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>
        <View style={styles.imgView}>
          <ImageComponent source={{uri: user?.image}} style={styles.avatar} />
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
          <Text style={styles.university}>{user.university}</Text>

          {showDetails && otherDetails}

          <TouchableOpacity
            onPress={() => setShowDetails(!showDetails)}
            style={styles.viewBtn}>
            <Text style={styles.viewToggleText}>
              {showDetails ? 'View Less' : 'View Details'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => onToggleFavourite?.(user.id)}>
          <Icon
            name={isFavourite ? 'heart' : 'heart-o'}
            size={Utils.calculateWidth(22)}
            color={isFavourite ? '#ff4757' : '#fff'}
          />
        </TouchableOpacity>
      </LinearGradient>
    );
  },
);

export default CardItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Utils.calculateWidth(12),
    borderRadius: Utils.calculateWidth(16),
    marginBottom: Utils.calculateHeight(12),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: Utils.calculateWidth(50),
    height: Utils.calculateWidth(50),
    borderRadius: Utils.calculateWidth(8),
  },
  imgView: {
    borderRadius: Utils.calculateWidth(8),
    borderWidth: 2,
    borderColor: '#fff',
    padding: Utils.calculateWidth(2),
  },
  content: {flex: 1, marginHorizontal: Utils.calculateWidth(10)},
  name: {
    fontSize: fontSize.fontSize_16,
    fontFamily: fontFamily.Bold,
    color: '#fff',
  },
  email: {
    fontSize: fontSize.fontSize_14,
    fontFamily: fontFamily.Book,
    color: '#f0f0f0',
    marginTop: Utils.calculateHeight(2),
  },
  phone: {
    fontSize: fontSize.fontSize_14,
    fontFamily: fontFamily.Book,
    color: '#f0f0f0',
    marginTop: Utils.calculateHeight(2),
  },
  university: {
    fontSize: fontSize.fontSize_12,
    fontFamily: fontFamily.Medium,
    color: '#dcdcdc',
    marginTop: Utils.calculateHeight(2),
    fontStyle: 'italic',
  },
  viewBtn: {marginTop: Utils.calculateHeight(4)},
  viewToggleText: {
    color: '#FFD700',
    textDecorationLine: 'underline',
    fontFamily: fontFamily.Medium,
  },
  otherDetail: {
    fontFamily: fontFamily.Book,
    fontSize: fontSize.fontSize_12,
    color: '#f0f0f0',
    marginTop: Utils.calculateHeight(2),
  },
  bold: {fontFamily: fontFamily.Bold, color: '#fff'},
});
