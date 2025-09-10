import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <PaperProvider>
      <LinearGradient
        colors={['#ff004d', '#ffffff']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.container}>

          {/* Logo */}
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode={FastImage.resizeMode.contain}
          />

          {/* Welcome Text */}
          <Text style={styles.title}>Welcome to Mason!</Text>
          <Text style={styles.subtitle}>You’re all set! Start exploring Mason now</Text>

          <LottieView
            source={require('../assets/welcome.json')}
            autoPlay
            loop={false}
            style={{ width: 150, height: 150 }}
            />

          {/* Button */}
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Go Home</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  gradient:{
    flex:1,
  },
  container:{
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingBottom: 40,
  },
  logo:{
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  title:{
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginTop: 10,
  },
  subtitle:{
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
    textAlign: 'center',
  },
  gif:{
    width: 120,
    height: 120,
    marginVertical: 30,
  },
  button:{
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  buttonText:{
    color: '#d10c42',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
