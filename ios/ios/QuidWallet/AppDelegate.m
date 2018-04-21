#import "AppDelegate.h"
#import "Firebase.h"
#import "RNFirebaseMessaging.h"

#import "RCCManager.h"
#import <React/RCTRootView.h>

#import <React/RNSentry.h> // This is used for versions of react >= 0.40

#import <React/RCTBundleURLProvider.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  
  [Fabric with:@[[Crashlytics class]]];
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation];

  [RNSentry installWithBridge:[[RCCManager sharedInstance] getBridge]];
  return YES;
}


-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RNFirebaseMessaging didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo {
  [RNFirebaseMessaging didReceiveRemoteNotification:userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [RNFirebaseMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
	 withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  [RNFirebaseMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
	 withCompletionHandler:(void (^)(void))completionHandler {
  [RNFirebaseMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}


@end
