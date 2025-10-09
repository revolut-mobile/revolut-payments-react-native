package com.revolutpaylitedemo

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.revolut.revolutpaylite.api.RevolutPaymentControllerHolder
import com.revolut.revolutpaylite.api.RevolutPaymentControllerWrapper

class MainActivity : ReactActivity(), RevolutPaymentControllerHolder {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "RevolutPayLiteDemo"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    /**
     * Should be defined unconditionally for future Revolut Pay payments
     */
    override val paymentController: RevolutPaymentControllerWrapper =
        RevolutPaymentControllerWrapper(this)
}
