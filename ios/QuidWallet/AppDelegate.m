#import "AppDelegate.h"
#import "Firebase.h"

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
  [Fabric with:@[[Crashlytics class]]];
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation];

  [RNSentry installWithBridge:[[RCCManager sharedInstance] getBridge]];
  
  return YES;
}

@end
