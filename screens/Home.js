// ShopScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import {
  Avatar,
  Provider as PaperProvider,
  Card,
  Text as PaperText,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'react-native';
import { RefreshControl } from 'react-native';

const screenWidth = Dimensions.get('window').width;

/* ────────────────────────────────────────────────
 *  Helpers
 * ──────────────────────────────────────────────── */
const getImage = (url, placeholder) =>
  url && typeof url === 'string' ? { uri: url } : placeholder;

/* ────────────────────────────────────────────────
 *  Main component
 * ──────────────────────────────────────────────── */
function ShopScreen() {
  /* ---------- state ---------- */
  const [categories, setCategories]     = useState([]);
  const [stores, setStores]             = useState([]);
  const [topStores, setTopStores]       = useState([]);
  const [purchasedStores, setPurchased] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showAll, setShowAll]           = useState(false);
 const [wallet, setWallet] = useState({
    deposit: 0,
    purchase: 0,
    balance: 0,
  });


  const [mainLocation, setMainLocation] = useState('Detect Location');
  const [subAddress, setSubAddress] = useState('');

  const fetchAddress = async () => {
    const savedAddress = await AsyncStorage.getItem('userAddress');
    if (savedAddress) {
      // Example: Split into first part and rest
      const parts = savedAddress.split(',');
      setMainLocation(parts[0] || 'My Location');
      setSubAddress(parts.slice(1, 3).join(', '));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchAddress);
    fetchAddress();
    return unsubscribe;
  }, [navigation]);

const [refreshing, setRefreshing] = React.useState(false);

const onRefresh = () => {
  setRefreshing(true);

  // Simulate an API call or re-render
  setTimeout(() => {
    setRefreshing(false);
  }, 1500);
};


 


  const navigation = useNavigation();
  const visibleShops = showAll ? stores : stores.slice(0, 8);

  const handleIconPress = (label) => {
    switch (label) {
      case 'Scan QR':
        navigation.navigate('ScannerScreen');
        break;
    
      case 'Purchase':
        navigation.navigate('MyPurchase');
        break;
      default:
        console.warn('No action for:', label);
    }
  };

  /* ---------- fetch data ---------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        /* categories */
        const catRes  = await fetch('https://kickbuy.org/api/category_api');
        const catJson = await catRes.json();
        const catArr  =
          catJson.categories ?? catJson.data ?? catJson ?? [];
        setCategories(Array.isArray(catArr) ? catArr : []);

        /* stores (all) */
        const storeRes  = await fetch('https://kickbuy.org/api/store_api');
        const storeJson = await storeRes.json();
        const storeArr  =
        storeJson.stores ?? storeJson.data ?? storeJson ?? [];
        setStores(Array.isArray(storeArr) ? storeArr : []);

        /* top shops: flag `is_top === '1'` OR first 6 fallback */
        const tops = storeArr.filter(s => String(s.is_top) === '1');
        setTopStores(tops.length ? tops : storeArr.slice(0, 6));
        
        /* shops purchased by THIS user */
        const userId = await AsyncStorage.getItem('user_id'); // adjust key if different
        if (userId) {
          const txRes  = await fetch(
            `https://kickbuy.org/api/shop_transaction?user_id=${userId}`
          );
          const txJson = await txRes.json();
          // NOTE: the API returns `stores`
          const txArr  = txJson.stores ?? txJson.data ?? txJson ?? [];
          setPurchased(Array.isArray(txArr) ? txArr : []);
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Unable to fetch categories / shops');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

 
  useEffect(() => {
    const loadWallet = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          const response = await fetch(`https://kickbuy.org/api/wallet_show?user_id=${userId}`);
          const json = await response.json();

          setWallet({
            deposit: parseFloat(json['Deposit'] || 0),
            purchase: parseFloat(json['purchase_amt'] || 0),
            balance: parseFloat(json['wallet_balance'] || 0),
          });
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Unable to fetch wallet data');
      }
    };

    loadWallet();
  }, []);

  
  /* ---------- render while loading ---------- */
  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: '#fff' }]}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  /* ---------- UI ---------- */
  return (
    
    <View style={styles.container} >
      <ScrollView
  contentContainerStyle={{ paddingBottom: 90 }}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>

      <View style={styles.customHeader}>
          <Image
            source={require('../assets/kickby-logo.png')}
            style={styles.logoImage}
          />
          <TextInput style={styles.searchInput} placeholder="Search" />
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Avatar.Image size={36} source={require('../assets/profile.png')} />
          </TouchableOpacity>
        </View>



    

<View style={styles.walletCardContainer}>
  <ImageBackground
    source={require('../assets/wallet-bg.png')} // ✅ Use valid local image path
    style={styles.walletCard}
    imageStyle={{ borderRadius: 10 }}
  >
    <View style={styles.walletOverlay}>
      <Text style={styles.walletText}>Wallet Balance</Text>
      <Text style={styles.walletAmount}>₹{wallet.balance}</Text>

       <Card style={styles.actionCard}>
        <Card.Content>
          <View style={styles.iconRow}>
      {[
        { label: 'Scan QR', icon: 'qrcode-scan' },
        { label: 'Deposit', icon: 'bank' },
        { label: 'Withdraw', icon: 'cash-minus' },
        { label: 'History', icon: 'gift' },
      ].map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.iconItem}
          onPress={() => handleIconPress(item.label)}
        >
          <Icon name={item.icon} size={30} color="#000" />
          <Text style={styles.iconLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
        </Card.Content>
      </Card> 
    </View>
  </ImageBackground>
</View>


        {/* Categories + Your Shops */}
        <View style={{ padding: 10 }}>
          {/* Categories */}
          <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Categories</Text>
  <TouchableOpacity onPress={() => navigation.navigate('AllCategories')}>
    <Text style={styles.seeAll}>See All</Text>
  </TouchableOpacity>
</View>


          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat, idx) => (
              <View key={idx} style={styles.categoryItem}>
                <Card style={{ padding: 10 }} onPress={() => navigation.navigate('Shop', { category_id: cat.id })}
>
                  <Image
                    source={getImage(
                      cat.image ?? cat.category_image,
                      require('../assets/grocery.png')
                    )}
                    style={styles.categoryImage}
                  />
                </Card>
                <Text style={styles.shopLabel}>
                  {cat.name ?? cat.category_name}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Your Shops (purchased) */}
       

          {/* All shops */}
       
           {purchasedStores.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>Recent Purchase</Text>
   
      <View style={styles.shopGrid}>
        {purchasedStores.slice(0, 8).map((shop, idx) => (
          <TouchableOpacity
            key={`p-${idx}`}
            style={styles.avatarWrapper}
            onPress={() => navigation.navigate('MyPurchase', { shop })}
          >
            <Image
              source={getImage(
                shop.logo ?? shop.image ?? shop.store_image,
                require('../assets/shop.png')
              )}
              style={styles.ShopImage}
            />
         <Text
  style={styles.shopLabel}
  numberOfLines={1}          // Limit to 1 line
  ellipsizeMode="tail"       // Show "..." if text is too long
>
  {shop.name ?? shop.store_name}
</Text>

          </TouchableOpacity>
        ))}
      </View>
  
  </>
)}

          {/* Top shops */}
         <Text style={styles.sectionTitle}>Top Shops</Text>
<View style={styles.topShopGrid}>
  {topStores.map((shop, idx) => (
    <TouchableOpacity
      key={idx}
      onPress={() =>
        navigation.navigate('StoreDetails', { id: shop.vendor_id })
      }
    >
      <Card style={styles.topShopGridItem}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Image
            source={getImage(
              shop.logo ?? shop.image ?? shop.store_image,
              require('../assets/topshop.png')
            )}
            style={styles.topShopImage}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              marginTop: 8,
              fontSize: 10,
              textAlign: 'center',
              maxWidth: 80,
            }}
          >
            {(shop.name ?? shop.store_name)?.split(' ').slice(0, 2).join(' ')}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  ))}
</View>

        </View>
      </ScrollView>

      {/* ---------- bottom navigation ---------- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={26} color="#FFD700" />
          <PaperText style={styles.navLabel}>Home</PaperText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Shop')}
        >
          <Icon name="storefront" size={26} color="#FFD700" />
          <PaperText style={styles.navLabel}>Shop</PaperText>
        </TouchableOpacity>

        {/* Center scan button */}
       <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('ScannerScreen')}
        >
          <Icon name="qrcode-scan" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('MyPurchase')}
        >
          <Icon name="cart" size={26} color="#FFD700" />
          <PaperText style={styles.navLabel}>Purchase</PaperText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Icon name="wallet" size={26} color="#FFD700" />
          <PaperText style={styles.navLabel}>Profile</PaperText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ────────────────────────────────────────────────
 *  Wrapper so the file can run standalone
 * ──────────────────────────────────────────────── */
export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ShopScreen />
      </SafeAreaView>
    </PaperProvider>
  );
}

/* ────────────────────────────────────────────────
 *  Styles
 * ──────────────────────────────────────────────── */
const styles = StyleSheet.create({
     headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mainLocation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  subAddress: {
    fontSize: 12,
    color: '#666',
    maxWidth: 180,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
 container: { flex: 1, backgroundColor: '#EAFFCD' },
  /* header */
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  logoImage: { width: 100, height: 100, resizeMode: 'contain' },
  searchInput: {
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    width: 150,
  },

  /* wallet */
  walletCardContainer: { padding: 10, marginTop: 10 },
 walletCard: {
  borderRadius: 20,
  overflow: 'hidden',
  borderBottomRightRadius:20,
  borderBottomLeftRadius:20,
 
  marginBottom: 5,
  height: 190, // ensure it has height
  justifyContent: 'center',
},

walletOverlay: {
  flex: 1,
 
  padding: 10,
  borderRadius: 10,
  justifyContent: 'center',
},

walletText: {
  fontSize: 16,
  color: '#EAFFCD',
  textAlign: 'center',
  marginTop:20,
},

walletAmount: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#FFC40c',
  textAlign: 'center',
  marginVertical: 10,
},
  actionCard: {
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between' },
  iconItem: { alignItems: 'center', flex: 1 },
  iconLabel: { marginTop: 4, fontSize: 12, textAlign: 'center' },

  /* categories / shops */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600', 
    marginTop: 35,
  },
  categoryItem: { alignItems: 'center', marginRight: 15 },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },

  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    
  },
  avatarWrapper: {
    width: screenWidth / 4 - 15,
    alignItems: 'center',
    marginVertical: 10,
  },
 shopLabel: {
  marginTop: 15, // 🔽 reduce spacing from image
  fontSize: 12,
  textAlign: 'center',
  maxWidth: 80, // optional: prevent overly long labels
  lineHeight: 14, // optional: tighter text
},

  ShopImage: {
  width: 60,
  height: 60,
  borderRadius: 50,
  borderWidth: 2,
  borderColor: 'white',
  backgroundColor: '#fff', // helps shadow look cleaner
  // iOS shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  // Android shadow
  elevation: 5,
}
,

  /* top shops */
  topShopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop:15,
  },
  topShopGridItem: {
    width: screenWidth / 3- 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  topShopImage: { width: 80, height: 80, borderRadius: 20 },

  /* bottom nav */
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    height: 65,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    paddingHorizontal: 10,
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 10, marginTop: 2 },
  scanButton: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    backgroundColor: '#2e7d32',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
  paddingHorizontal: 10
},
sectionTitle: {
  fontSize: 18,
  marginTop:20,
  fontWeight: 'bold'
},
seeAll: {
  color: '#007bff',
  fontSize: 14
}
,
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  mainLocation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  subAddress: {
    fontSize: 12,
    color: '#666',
    maxWidth: 200
  }

});
