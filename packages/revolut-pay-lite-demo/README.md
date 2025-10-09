# Getting Started

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see the demo app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run the demo app — you can also build it directly from Android Studio or Xcode.

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Getting Started

## How it works

From an implementation perspective, the SDK works with the following components:

1. **Client-side:** initialise the SDK by providing your Merchant Public API key and selecting the preferred environment to prepare for accepting payments.
2. **Server-side:** create an order and get `token`, using the [Merchant API: Create an order](https://developer.revolut.com/docs/merchant/create-order) endpoint.
3. **Client-side:** In your app, use the `RevolutPayButton` component which handles the complete payment flow, including order creation and payment processing.
4. **Client-side:** The SDK opens the Revolut Pay interface, where customers can complete their payment using their Revolut account or card.
5. **Endpoint for webhooks:** optionally, you can set up an endpoint which receives webhook events from the Merchant API to track the payment lifecycle. For more information, see: [Use webhooks to keep track of the payment lifecycle](https://developer.revolut.com/docs/merchant/webhooks).

## Build and run demo app

1. Clone the repository:
   ```bash
   git clone https://github.com/revolut-mobile/revolut-payments-react-native.git
   ```
2. Navigate to the merchant card form demo:

   ```bash
   cd revolut-payments-react-native/packages/revolut-pay-lite-demo
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
4. [Implement Revolut Pay button](#4-implement-revolut-pay-button)
5. [Button Styling Options](#5-button-styling-options)
6. [Handle the payment results](#6-handle-payment-results)
7. [Deeplinking configuration](#7-deep-link-configuration)
8. [Error handling](#8-error-handling)
9. [Promotional Banner (optional)](#9-optional-promotional-banner)
10. [Set up webhooks (optional)](#10-optional-set-up-webhooks)

### Before you begin

Before you start this tutorial, ensure you have completed the following steps:

- [Apply for a Merchant account](https://developer.revolut.com/docs/guides/accept-payments/get-started/apply-for-a-merchant-account)
- [Generate the API key](https://developer.revolut.com/docs/guides/accept-payments/get-started/generate-the-api-key)

## Implement the Revolut Pay Lite SDK

### 1. Install the SDK

Add the Revolut Pay Lite SDK dependencies to your React Native project:

```bash
# Using npm
npm install @revolut/revolut-pay-lite @revolut/revolut-payments-core

# OR using Yarn
yarn add @revolut/revolut-pay-lite @revolut/revolut-payments-core
```

### 2. Initialise the SDK

Before you can process payments, you need to configure the SDK with your **merchant public key** and the desired **environment**. This should be done once, typically in your app's main component or during app initialization.

```typescript
import { RevolutPaymentsSDK } from '@revolut/revolut-pay-lite';

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

### 4. Implement Revolut Pay button

Here's a complete example of how to implement the Revolut Pay button in your React Native component:

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, SafeAreaView } from 'react-native';
import {
  RevolutPaymentsSDK,
  RevolutPayButton,
  RevolutPayCompletionEvent
} from '@revolut/revolut-pay-lite';

const CheckoutScreen = () => {
  const [sdkConfigured, setSdkConfigured] = useState<boolean>(false);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        await RevolutPaymentsSDK.configure(
          'your_merchant_public_key_here',
          'sandbox' // or 'production'
        );
        setSdkConfigured(true);
      } catch (error) {
        console.error('SDK Configuration Error:', error);
        Alert.alert('Error', 'Failed to initialize payment SDK');
      }
    };

    initializeSDK();
  }, []);

  const handleCreateOrder = async (): Promise<string> => {
    // This function should call your backend to create an order
    // and return the order token
    try {
      const response = await fetch('https://your-backend.com/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000, // Amount in cents
          currency: 'GBP',
          // Add other order details as needed
        }),
      });

      const orderData = await response.json();
      return orderData.token; // Return the order token
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  };

  const handlePaymentCompletion = (event: RevolutPayCompletionEvent) => {
    const { status, error } = event.nativeEvent;
    console.log(`Payment completed with status: ${status}`);

    switch (status) {
      case 'success':
        Alert.alert('Success!', 'Payment was successful.');
        // Navigate to success screen or update UI
        break;
      case 'failure':
        Alert.alert('Payment Failed', error || 'Unknown error occurred');
        // Handle payment failure
        break;
      case 'userAbandoned':
        Alert.alert('Cancelled', 'User cancelled the payment.');
        // Handle user cancellation
        break;
    }
  };

  if (!sdkConfigured) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Initializing payment SDK...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Checkout
      </Text>

      {/* Order summary here */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Order Total: £10.00</Text>
        <Text style={{ color: '#666' }}>Pay securely with Revolut Pay</Text>
      </View>

      {/* Revolut Pay Button */}
      <RevolutPayButton
        buttonStyle={{
          size: 'medium',
          radius: 'small',
          attachmentStyle: {
            currency: 'GBP',
          },
        }}
        returnURL={'your-app://payment-return'} // Your app's deep link URL
        onCreateOrder={handleCreateOrder}
        onCompletion={handlePaymentCompletion}
      />
    </SafeAreaView>
  );
};

export default CheckoutScreen;
```

### 5. Button Styling Options

The `RevolutPayButton` component supports various styling options to match your app's design:

```typescript
<RevolutPayButton
  buttonStyle={{
    size: 'small' | 'medium' | 'large' | 'extraSmall',
    radius: 'small' | 'large',
    attachmentStyle: {
      currency: 'GBP', // Display currency in button
    } | null, // Set to null to hide currency
    variants: {
      anyMode: 'light' | 'dark', // Force light or dark theme
    },
  }}
  returnURL={'your-app://payment-return'}
  onCreateOrder={handleCreateOrder}
  onCompletion={handlePaymentCompletion}
/>
```

### 6. Handle payment results

The `onCompletion` callback receives a `RevolutPayCompletionEvent` with the payment result:

```typescript
const handlePaymentCompletion = (event: RevolutPayCompletionEvent) => {
  const { status, error } = event.nativeEvent;

  switch (status) {
    case 'success':
      // Payment was successful
      console.log('Payment successful');
      // Update UI, navigate to success screen, etc.
      break;

    case 'failure':
      // Payment failed
      console.log('Payment failed:', error);
      // Show error message to user
      break;

    case 'userAbandoned':
      // User cancelled the payment
      console.log('Payment cancelled by user');
      // Handle user cancellation
      break;
  }
};
```

### 7. Deep Link Configuration

#### iOS Configuration

When the user is redirected from the Revolut app back to yours, you must pass the incoming URL to the SDK.

Your implementation depends on your app's lifecycle management. Use the UISceneDelegate method for modern, scene-based apps (the default since iOS 13), which support features like multiple windows on iPad. Use the AppDelegate method for older apps or if you have explicitly opted out of the scene-based lifecycle.

```swift
func scene(
  _ scene: UIScene,
  openURLContexts URLContexts: Set<UIOpenURLContext>
) {
    if let url = URLContexts.first?.url {
        RevolutPayKit.handle(url: url)
    }
}
```

#### Android Configuration

#### Step 1: Configure the App Manifest

You need to declare necessary permissions and app-querying capabilities in your
`AndroidManifest.xml`.

**Add internet permission:** The SDK required network access.

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

**Declare Revolut app query:** To allow the SDK to check if the Revolut app is installed, add the
`<queries>` element.

```xml
<queries>
    <package android:name="com.revolut.revolut" />
</queries>
```

#### Step 2: Set up a deep link for redirection

A deep link is required for the Revolut app to redirect the user back to your app after payment
authorisation.

In your `AndroidManifest.xml`, add an `<intent-filter>` to the activity that will handle the result.

```xml
<activity android:name=".MainActivity" android:launchMode="singleTop">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:host="payment-return" android:scheme="myapp" />
  </intent-filter>
</activity>
```

#### Step 3: Register payment launcher and propagate uri

Update your `MainActivity.kt` to implement `RevolutPaymentControllerHolder`:

```kotlin
package your.app.name

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.content.Intent
import com.revolut.revolutpaylite.api.RevolutPaymentControllerHolder
import com.revolut.revolutpaylite.api.RevolutPaymentControllerWrapper

// Implement RevolutPaymentControllerHolder
class MainActivity : ReactActivity(), RevolutPaymentControllerHolder {

  override fun getMainComponentName(): String = "YourAppName"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  // Delcare RevolutPaymentControllerWrapper uncondtinonally
  override val paymentController: RevolutPaymentControllerWrapper =
    RevolutPaymentControllerWrapper(this)

}
```

#### Step 3: Handle deep link redirect

After the customer authorises the payment (either in the Revolut app or the web flow), they are
redirected back to your app using the deep link you configured before

You need to catch this redirect in the `Activity` you configured with the `<intent-filter>`. To do
this, override the `onNewIntent()` method and pass the incoming URI to the Revolut Pay SDK for
processing.

```kotlin
override fun onNewIntent(intent: Intent?) {
  super.onNewIntent(intent)
  intent?.data?.let { uri ->
    // Pass the deep link URI to the Revolut Pay SDK for processing
    paymentController.handle(uri)
  }
}
```

### 8. Error handling

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

### 9. (Optional) Promotional Banner

You can also display a Revolut Pay promotional banner to increase payment method awareness:

```typescript
import { RevolutPayPromotionalBanner } from '@revolut/revolut-pay-lite';

<RevolutPayPromotionalBanner
  bannerStyle={{
    size: 'small' | 'medium' | 'large',
    variants: {
      anyMode: 'light' | 'dark',
    },
  }}
/>
```

### 10. (Optional) Set up webhooks

While your app receives the immediate result of the payment, this only confirms the initial status to the client. For a reliable and complete payment system, you should also use webhooks to receive server-to-server notifications about the order and payment lifecycle.

Webhooks are essential for a few key reasons:

- **Source of truth:** They provide a reliable way for your backend to track the final state of a payment, such as when it's been captured.
- **Resilience:** They ensure your system can handle cases where the user closes your app or loses connection after paying but before the client-side result is processed.
- **Asynchronous updates:** They notify you of events that happen after the initial payment, such as refunds or chargebacks.

By utilising both in-app payment result handling for immediate user feedback and webhooks for backend reconciliation, you create a robust and responsive payment processing system.

To learn how to implement webhooks, see our tutorial: [Use webhooks to track order and payment lifecycle](https://developer.revolut.com/docs/merchant/webhooks).
