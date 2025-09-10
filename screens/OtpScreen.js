import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const navigation = useNavigation();

  const handleOtpChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (index < 5) inputs.current[index + 1].focus();
    } else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      // All OTP digits filled - redirect
      navigation.navigate('UserName'); // Replace 'NextScreen' with your actual screen name
    }
  }, [otp]);

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Card Section */}
        <LinearGradient
          colors={['#ED1C24', '#D4145A']}
          style={styles.card}
        >
          <Text style={styles.title}>Enter Verification Code</Text>

          <View style={styles.row}>
            <Text style={styles.sentText}>Sent to +91 98940XXXXX</Text>
            <Icon name="pencil" size={18} color="white" style={{ marginLeft: 8 }} />
          </View>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                ref={(ref) => (inputs.current[index] = ref)}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  card: {
    width: width,
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    alignItems: 'flex-start',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 5,
    marginBottom: 10,
  },
  sentText: {
    color: 'white',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 5,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginLeft: 23,
    alignItems: 'center',
    gap: 10,
  },
  otpInput: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    gap: 20,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginLeft:90,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#ED1C24',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OtpScreen;
