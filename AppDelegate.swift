// File: ios/App/App/AppDelegate.swift
import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        configureAppearance()
        return true
    }

    /**
     * Applies Apple Human Interface Guidelines (HIG) styling with Emerald (#064e3b)
     * status bar & safe-area container background.
     */
    private func configureAppearance() {
        let emeraldColor = UIColor(red: 6.0 / 255.0, green: 78.0 / 255.0, blue: 59.0 / 255.0, alpha: 1.0)
        window?.backgroundColor = emeraldColor
        UINavigationBar.appearance().barTintColor = emeraldColor
        UINavigationBar.appearance().tintColor = UIColor(red: 217.0 / 255.0, green: 119.0 / 255.0, blue: 6.0 / 255.0, alpha: 1.0)
    }

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        return ApplicationDelegateProxy.shared.application(
            application,
            continue: userActivity,
            restorationHandler: restorationHandler
        )
    }
}
