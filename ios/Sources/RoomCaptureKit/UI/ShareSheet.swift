#if canImport(UIKit) && canImport(SwiftUI)
import SwiftUI
import UIKit

/// Wraps `UIActivityViewController` for use in SwiftUI.
public struct ShareSheet: UIViewControllerRepresentable {
    public var items: [Any]

    public init(items: [Any]) {
        self.items = items
    }

    public func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    public func updateUIViewController(_ controller: UIActivityViewController, context: Context) {}
}
#endif
