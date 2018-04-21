package com.quidwallet.quidwalletapp;
import android.support.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.reactnativenavigation.NavigationApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import io.sentry.RNSentryPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; 
import com.bitgo.randombytes.RandomBytesPackage;
import co.airbitz.fastcrypto.RNFastCryptoPackage;
import java.util.Arrays;
import java.util.List;


public class MainApplication extends NavigationApplication {

    public void onCreate() {
       super.onCreate();
       Fabric.with(this, new Crashlytics());
    }
    
    
  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @NonNull
  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    // Add the packages you require here.
    // No need to add RnnPackage and MainReactPackage
      return Arrays.<ReactPackage>asList(
					 new RNDeviceInfo(),
					 new FabricPackage(),
					 new ReactNativeConfigPackage(),
					 new RNSentryPackage(MainApplication.this),
					 new RNFirebasePackage(),
					 new RNFirebaseMessagingPackage(),
					 new RandomBytesPackage(),
					 new RNFastCryptoPackage()
					 );
  }

}

