import { RevolutPayPromotionalBanner } from '@revolut/revolut-pay-lite';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export const RevolutPayPromotionalBannerSample = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>RevolutPayPromotionalBanner</Text>
      <RevolutPayPromotionalBanner
        style={{ flex: 0.7 }}
        transactionId={'random_transaction_id'}
        amount={1000}
        currency="GBP"
      />
    </SafeAreaView>
  );
};

export default RevolutPayPromotionalBannerSample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 5,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});
