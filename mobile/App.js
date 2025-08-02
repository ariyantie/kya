import React, { useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/constants/theme';
import LoadingScreen from './src/screens/LoadingScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import NotificationService from './src/services/NotificationService';
import SocketService from './src/services/SocketService';
import { setNetworkStatus } from './src/store/slices/appSlice';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Setting a timer for a long period of time',
  'Possible Unhandled Promise Rejection',
]);

// Custom fonts
const customFonts = {
  'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
  'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
  'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
};

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts and other resources
        await Font.loadAsync(customFonts);
        
        // Initialize notification service
        await NotificationService.initialize();
        
        // Setup network monitoring
        setupNetworkMonitoring();
        
        // Initialize socket service
        SocketService.initialize();
        
        // Artificial delay to show splash screen
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn('Error during app initialization:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const setupNetworkMonitoring = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      store.dispatch(setNetworkStatus({
        isConnected: state.isConnected,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
      }));
    });

    return unsubscribe;
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the splash screen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <PaperProvider theme={theme}>
            <SafeAreaProvider onLayout={onLayoutRootView}>
              <NavigationContainer theme={theme}>
                <AppNavigator />
                <StatusBar 
                  style={Platform.OS === 'ios' ? 'light' : 'auto'} 
                  backgroundColor={theme.colors.primary}
                />
              </NavigationContainer>
            </SafeAreaProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}