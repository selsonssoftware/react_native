import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function EnterNameScreen({ navigation }) {
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brand}>MASON</Text>
      </View>

      <LinearGradient
        colors={['#f42020', '#c6184e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.formContainer}
      >
        <Text style={styles.heading}>Enter Name</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>User Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder=""
            placeholderTextColor="#fff"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Referral Code</Text>
          <TextInput
            value={referralCode}
            onChangeText={setReferralCode}
            style={styles.input}
            placeholder="Optional"
            placeholderTextColor="#fff"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('WelcomeScreen')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
  },
  brand: {
    color: '#d3133f',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
    marginTop: 40,
    padding: 25,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 35,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#f42020',
    paddingHorizontal: 8,
    zIndex: 1,
    fontSize: 14,
    color: 'white',
  },
  input: {
    height: 55,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 20,
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 270,
    backgroundColor: 'white',
    borderRadius: 30,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#d3133f',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
