#if canImport(SwiftUI) && canImport(ARKit)
import SwiftUI
import ARKit

/// Simple scanning UI with start/stop/reset controls.
public struct ScanView: View {
    @StateObject private var capture = CaptureManager()

    public init() {}

    public var body: some View {
        VStack {
            Text("Room Capture")
                .font(.title)
            HStack {
                Button(capture.isScanning ? "Stop" : "Start") {
                    capture.isScanning ? capture.stop() : capture.start()
                }
                .padding()
                Button("Reset") { capture.reset() }
                    .padding()
            }
        }
    }
}
#endif
