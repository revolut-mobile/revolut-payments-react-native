import { PaymentError } from '@revolut/revolut-merchant-card-form';

interface UserFriendlyError {
  title: string;
  message: string;
}

export const getUserFriendlyErrorMessage = (
  error: PaymentError
): UserFriendlyError => {
  switch (error.code) {
    case 'failed':
    case 'declined':
      switch (error.reason) {
        case 'insufficientFunds':
          return {
            title: 'Insufficient Funds',
            message:
              'Your card does not have enough funds. Please top up your account or try a different card.',
          };
        case 'expiredCard':
          return {
            title: 'Card Expired',
            message:
              'The card you are using has expired. Please use a valid card.',
          };
        case 'invalidCVV':
        case 'invalidCard':
          return {
            title: 'Card Details Incorrect',
            message:
              'The card number or CVV is incorrect. Please double-check your details and try again.',
          };
        default:
          return {
            title: 'Payment Declined',
            message: error.reason,
          };
      }
    case 'timeout':
      return {
        title: 'Connection Timed Out',
        message:
          "We couldn't process your payment in time. Please check your internet connection and try again.",
      };
    case 'orderNotFound':
    case 'orderNotAvailable':
      return {
        title: 'Order Issue',
        message:
          'There was a problem retrieving your order details. Please check your order token.',
      };
    default:
      return {
        title: 'An Unexpected Error Occurred',
        message:
          'Something went wrong on our end. Please wait a moment and try again.',
      };
  }
};
