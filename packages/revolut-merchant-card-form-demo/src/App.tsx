import {
  PaymentError,
  RevolutMerchantCardFormCompletionEvent,
  RevolutMerchantCardFormKit,
  RevolutPaymentsSDK,
} from '@revolut/revolut-merchant-card-form';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ErrorMessage } from './ErrorMessage';
import { getUserFriendlyErrorMessage } from './utils/paymentErrorUtils';
// https://developer.revolut.com/docs/guides/accept-payments/get-started/test-implementation/test-cards#test-for-successful-payments

const MERCHANT_PUBLIC_KEY = 'MERCHANT_PUBLIC_KEY';
const ENVIRONMENT = 'sandbox';

export default function App() {
  const [configurationStatus, setConfigurationStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'loading' | 'success' | 'userAbandoned' | 'error'
  >('idle');
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);
  const [orderToken, setOrderToken] = useState<string>('');

  useEffect(() => {
    const initializeSdk = async () => {
      try {
        await RevolutPaymentsSDK.configure(MERCHANT_PUBLIC_KEY, ENVIRONMENT);
        setConfigurationStatus('success');
      } catch (error) {
        console.error('SDK Configuration Error:', error);
        setConfigurationStatus('error');
      }
    };
    initializeSdk();
  }, []);

  const handlePayPress = async () => {
    if (!orderToken.trim()) {
      Alert.alert('Please enter an Order Token.');
      return;
    }
    setPaymentStatus('loading');
    setPaymentError(null);

    try {
      const result: RevolutMerchantCardFormCompletionEvent =
        await RevolutMerchantCardFormKit.pay(orderToken);

      switch (result.status) {
        case 'success':
          setPaymentStatus('success');
          break;
        case 'userAbandoned':
          setPaymentStatus('userAbandoned');
          break;
        case 'failure':
          const error = result.error;
          setPaymentStatus('error');
          setPaymentError(error);
          break;
      }
    } catch (e) {
      const error = e as Error;
      setPaymentError({
        code: 'internalError',
        message: error.message || 'An unexpected error occurred.',
      });
      setPaymentStatus('error');
    }
  };

  const renderPaymentUI = () => (
    <View style={styles.card}>
      <Text style={styles.headerTitle}>Revolut Payments</Text>
      <Text style={styles.statusText}>
        SDK configured successfully. Ready to pay.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Order Token (Public ID)"
        placeholderTextColor="#999"
        value={orderToken}
        onChangeText={setOrderToken}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={[
          styles.button,
          paymentStatus === 'loading' && styles.buttonDisabled,
        ]}
        onPress={handlePayPress}
        disabled={paymentStatus === 'loading'}
      >
        <Text style={styles.buttonText}>
          {paymentStatus === 'loading' ? 'Processing...' : 'Pay Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentStatus = () => {
    if (paymentStatus === 'idle') return null;
    switch (paymentStatus) {
      case 'loading':
        return (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={styles.statusFeedback}
          />
        );
      case 'error':
        if (paymentError) {
          const friendlyError = getUserFriendlyErrorMessage(paymentError);
          return (
            <ErrorMessage
              title={friendlyError?.title}
              message={friendlyError?.message}
            />
          );
        }
        return <Text style={styles.errorText}>An unknown error occurred.</Text>;
      case 'success':
        return (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>Payment Completed</Text>
          </View>
        );
      case 'userAbandoned':
        return (
          <ErrorMessage
            title="User Abandoned Payment"
            message="userAbandonedPayment"
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {configurationStatus === 'loading' && (
        <ActivityIndicator size="large" color="#007AFF" />
      )}
      {configurationStatus === 'error' && (
        <Text style={styles.errorText}>
          Failed to configure SDK. Check console.
        </Text>
      )}
      {configurationStatus === 'success' && renderPaymentUI()}
      {renderPaymentStatus()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '95%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F7F7F7',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D8000C',
    textAlign: 'center',
    marginTop: 20,
  },
  statusFeedback: {
    marginTop: 24,
  },
  successContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 32,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28A745',
    marginTop: 8,
  },
  errorContainer: {
    marginTop: 24,
    backgroundColor: '#FFF3F3',
    borderColor: '#FFB8B8',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#D8000C',
  },
  errorMessage: {
    fontSize: 14,
    color: '#D8000C',
    marginTop: 4,
  },
});
