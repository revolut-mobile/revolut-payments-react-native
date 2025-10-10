import {
  RevolutPayButton,
  RevolutPayCompletionEvent,
} from '@revolut/revolut-pay-lite';
import { Alert, SafeAreaView, StyleSheet, Text } from 'react-native';

export const RevolutPayButtonSample = () => {
  const handleCreateOrder = async () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // Replace with actual call to generate order token
        const orderToken = 'ORDER_TOKEN';
        resolve(orderToken);
      }, 1500);
    });
  };

  const handleCompletion = (event: RevolutPayCompletionEvent) => {
    const { status, error } = event.nativeEvent;
    console.log(`Payment completed with status: ${status}`);

    switch (status) {
      case 'success':
        Alert.alert('Success!', 'Payment was successful.');
        break;
      case 'failure':
        Alert.alert('Payment Failed', error);
        break;
      case 'userAbandoned':
        Alert.alert('Cancelled', 'User cancelled the payment.');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>RevolutPayButton styling</Text>

      <SafeAreaView style={{ marginBottom: 20 }}>
        <RevolutPayButton
          buttonStyle={{
            size: 'extraSmall',
            radius: 'small',
            attachmentStyle: {
              currency: 'AED',
            },
          }}
          returnURL={'myapp://revolut-pay'}
          onCreateOrder={handleCreateOrder}
          onCompletion={handleCompletion}
        />
      </SafeAreaView>

      <SafeAreaView style={{ marginBottom: 20 }}>
        <RevolutPayButton
          buttonStyle={{
            size: 'small',
            radius: 'small',
            attachmentStyle: {
              currency: 'BGN',
            },
          }}
          returnURL={'myapp://revolut-pay'}
          onCreateOrder={handleCreateOrder}
          onCompletion={handleCompletion}
        />
      </SafeAreaView>

      <RevolutPayButton
        buttonStyle={{
          size: 'medium',
          radius: 'small',
          attachmentStyle: null,
        }}
        returnURL={'myapp://revolut-pay'}
        onCreateOrder={handleCreateOrder}
        onCompletion={handleCompletion}
      />

      <RevolutPayButton
        buttonStyle={{
          radius: 'large',
          attachmentStyle: null,
        }}
        returnURL={'myapp://revolut-pay'}
        onCreateOrder={handleCreateOrder}
        onCompletion={handleCompletion}
      />

      <RevolutPayButton
        buttonStyle={{
          radius: 'large',
          attachmentStyle: null,
          variants: {
            anyMode: 'light',
          },
        }}
        returnURL={'myapp://revolut-pay'}
        onCreateOrder={handleCreateOrder}
        onCompletion={handleCompletion}
      />

      <RevolutPayButton
        returnURL={'myapp://revolut-pay'}
        onCreateOrder={handleCreateOrder}
        onCompletion={handleCompletion}
      />
    </SafeAreaView>
  );
};

export default RevolutPayButtonSample;

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
  },
});
