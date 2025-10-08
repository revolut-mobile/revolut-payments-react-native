import { RevolutPaymentsSDK } from '@revolut/revolut-pay-lite';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import RevolutPayButtonSample from './pages/RevolutPayButtonSample';

const MERCHANT_PUBLIC_KEY = 'MERCHANT_PUBLIC_KEY';
const ENVIRONMENT = 'sandbox';

export default function App() {
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );

  const [sdkError, setSdkError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSdk = async () => {
      try {
        await RevolutPaymentsSDK.configure(MERCHANT_PUBLIC_KEY, ENVIRONMENT);
        setSdkStatus('success');
      } catch (error) {
        setSdkError(`SDK Initialization Error: ${error}`);
        setSdkStatus('error');
      }
    };

    initializeSdk();
  }, []);

  const renderContent = () => {
    switch (sdkStatus) {
      case 'loading':
        return <ActivityIndicator size="large" color="#0000ff" />;
      case 'error':
        return <Text style={styles.errorText}>{sdkError}</Text>;
      case 'success':
        return (
          <>
            <Text style={styles.statusText}>
              Successfully configured RevolutPaymentsSDK
            </Text>
            <RevolutPayButtonSample />
            {/* Uncomment next line to view promotional banner */}
            {/* <RevolutPayPromotionalBannerSample /> */}
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
});
