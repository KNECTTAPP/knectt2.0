import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNBootSplash
import Firebase


@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "KnecttApp",
      in: window,
      launchOptions: launchOptions
    )

    // ✅ SAFE WAY (delay until rootView exists)
    if let rootView = window?.rootViewController?.view {
      RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
    }

    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }

    return true
  }
  func application(
     _ app: UIApplication,
     open url: URL,
     options: [UIApplication.OpenURLOptionsKey : Any] = [:]
   ) -> Bool {

     return RCTLinkingManager.application(
       app,
       open: url,
       options: options
     )
   }
}


// ⬇️ SAME FILE me hi hai, koi naya file nahi
class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  // ✅ BEST PLACE – guaranteed rootView
  override func customize(_ rootView: RCTRootView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }
}
