import * as React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Provider as PaperProvider, Appbar, Card, Text, Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OtpScreen from './screens/OtpScreen'; // Make sure path is correct
import UserName from './screens/UserName';
import WelcomeScreen from './screens/WelcomeScreen';


function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="My Profile App" />
      </Appbar.Header>

      <View style={styles.container}>
        <Card style={[styles.card, { width: width * 0.9 }]}>
          <Card.Title title="Welcome!" subtitle="Paper UI on CLI" />
          <Card.Content>
            <Text>Your app is running on React Native CLI with Paper.</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => navigation.navigate('Otp')}>
              Get Started
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
          <Stack.Screen name="UserName" component={UserName} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 4,
  },
});
