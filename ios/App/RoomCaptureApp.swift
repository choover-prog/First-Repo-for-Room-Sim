#if os(iOS)
import SwiftUI
import UIKit
import RoomCaptureKit

/// Minimal demo application used for manual testing on device.
@main
struct RoomCaptureApp: App {
    @State private var room = Room(room: .init(L: 0, W: 0, H: 0),
                                   objects: [],
                                   meta: .init(device: UIDevice.current.model,
                                               pipeline: "arkit+roomplan",
                                               ts: Date().timeIntervalSince1970))
    var body: some Scene {
        WindowGroup {
            NavigationView {
                ScanView()
            }
        }
    }
}
#endif
