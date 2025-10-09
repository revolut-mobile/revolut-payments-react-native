# Getting Started

## How it works

From an implementation perspective, the SDK works with the following components:

1. **Client-side:** initialise the SDK by providing your Merchant Public API key and selecting the preferred environment to prepare for accepting payments.
2. **Server-side:** create an order and get `token`, using the [Merchant API: Create an order](https://developer.revolut.com/docs/merchant/create-order) endpoint.
3. **Client-side:** In your app, configure the SDK and use the `RevolutMerchantCardFormKit` component to handle payments. This component is responsible for presenting the payment UI and returning the final payment outcome to your app via a callback.
4. **Client-side:** Use the order token to call the `pay` method on the `RevolutMerchantCardFormKit`. This action presents the prebuilt UI, where the customer enters their card details and confirms the payment.
5. **Endpoint for webhooks:** optionally, you can set up an endpoint which receives webhook events from the Merchant API to track the payment lifecycle. For more information, see: [Use webhooks to keep track of the payment lifecycle](https://developer.revolut.com/docs/merchant/webhooks).

## Build and run demo app

1. Clone the repository:
   ```bash
   git clone https://github.com/revolut-mobile/revolut-payments-react-native.git
   ```
2. Navigate to the merchant card form demo:

   ```bash
   cd revolut-payments-react-native/packages/revolut-merchant-card-form-demo
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

4. For iOS, install CocoaPods dependencies:

   ```bash
   bundle install
   cd ios
   bundle exec pod install # install CocoaPods dependencies
   cd .. # navigate back to parent directory
   ```

   For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

5. Run the application:

   ```bash
   # For iOS
   npm run ios
   # or
   yarn ios

   # For Android
   npm run android
   # or
   yarn android
   ```

If everything is set up correctly, you should see the demo app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run the demo app — you can also build it directly from Android Studio or Xcode.

## Implementation overview

1. [Install the SDK](#1-install-the-sdk)
2. [Initialise the SDK](#2-initialise-the-sdk)
3. [Create an order](#3-create-an-order)
4. [Start the payment process](#4-start-the-payment-process)
5. [Handle the payment results](#5-handle-the-payment-results)
6. [Handle payment errors](#6-error-handling)

### Before you begin

Before you start this tutorial, ensure you have completed the following steps:

- [Apply for a Merchant account](https://developer.revolut.com/docs/guides/accept-payments/get-started/apply-for-a-merchant-account)
- [Generate the API key](https://developer.revolut.com/docs/guides/accept-payments/get-started/generate-the-api-key)

## Implement the Revolut Card Payments SDK

### 1. Install the SDK

Add the Revolut Merchant Card Form SDK dependencies to your React Native project:

```bash
# Using npm
npm install @revolut/revolut-merchant-card-form @revolut/revolut-payments-core

# OR using Yarn
yarn add @revolut/revolut-merchant-card-form @revolut/revolut-payments-core
```

### 2. Initialise the SDK

Before you can process payments, you need to configure the SDK with your **merchant public key** and the desired **environment**. This should be done once, typically in your app's main component or during app initialization.

```typescript
import { RevolutPaymentsSDK } from '@revolut/revolut-merchant-card-form';

const initializeSDK = async () => {
  try {
    await RevolutPaymentsSDK.configure(
      'MERCHANT_PUBLIC_KEY',
      'production', // you can use sandbox for testing
    );
    console.log('SDK configured successfully');
  } catch (error) {
    console.error('SDK Configuration Error:', error);
  }
};

initializeSDK();
```

### 3. Create an order

Before the payment form can be displayed in your app, your client-side code needs a unique, single-use `token` that represents the customer's order. This `token` can only be created on your server by making a secure call to the Revolut Merchant API.

Setting up this server-side endpoint is a **mandatory security requirement**. Your secret API key must never be exposed in your React Native application.

When a customer proceeds to checkout in your app, the app will call this endpoint. Your endpoint is then responsible for:

1.  Receiving the checkout details (e.g., `amount`, `currency`) from your client-side request.
2.  Securely calling the [Merchant API: Create an order endpoint](https://developer.revolut.com/docs/merchant/create-order) with the checkout details.
3.  Receiving the order object, including the public `token`, in the API response.
4.  Returning the `token` from the response to your app.

Your app will then use this `token` to launch the card payment interface provided by the SDK.

### 4. Start the payment process

This should only be called after successfully configuring the SDK. If done correctly, this will present a card input entry form to the user to enter their payment details. You must pass a valid order token for this to work.

```typescript
try {
    const result: RevolutMerchantCardFormCompletionEvent =
        await RevolutMerchantCardFormKit.pay(orderToken);
    handlePaymentResult(result: result);
}
```

### 5. Handle payment results

The `RevolutMerchantCardFormKit.pay()` method returns a promise that resolves to a `RevolutMerchantCardFormCompletionEvent` object. Handle the different payment outcomes as shown below:

```typescript
const handlePaymentResult = (
  result: RevolutMerchantCardFormCompletionEvent,
) => {
  switch (result.status) {
    case 'success':
      // Payment was successful
      // Update UI, navigate to success screen, etc.
      console.log('Payment successful');
      break;

    case 'failure':
      // Payment failed
      const error = result.error;
      console.log('Payment failed:', error);
      // Handle specific error types if needed
      break;

    case 'userAbandoned':
      // User cancelled the payment
      console.log('Payment cancelled by user');
      break;
  }
};
```

### 6. Error handling

The SDK provides detailed error information when payments fail. You can access error details from the `result.error` property:

```typescript
if (result.status === 'failure' && result.error) {
  const { code, message } = result.error;
  console.log(`Payment failed with code: ${code}, message: ${message}`);

  // Handle specific error codes
  switch (code) {
    case 'networkError':
      Alert.alert('Network Error', 'Please check your internet connection');
      break;
    case 'cardDeclined':
      Alert.alert(
        'Card Declined',
        'Your card was declined. Please try a different card.',
      );
      break;
    default:
      Alert.alert('Payment Error', message);
      break;
  }
}
```
