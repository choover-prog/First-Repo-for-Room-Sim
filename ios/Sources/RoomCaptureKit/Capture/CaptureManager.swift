#if canImport(ARKit)
import ARKit
import Combine

/// Handles ARKit/RoomPlan capture sessions and publishes mesh anchors.
@MainActor
public final class CaptureManager: NSObject, ObservableObject, ARSessionDelegate {
    @Published public private(set) var meshAnchors: [ARMeshAnchor] = []
    @Published public private(set) var isScanning = false
    private let session = ARSession()

    public override init() {
        super.init()
        session.delegate = self
    }

    /// Starts ARKit world tracking with mesh reconstruction.
    public func start() {
        let configuration = ARWorldTrackingConfiguration()
        if ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh) {
            configuration.sceneReconstruction = .mesh
        }
        if #available(iOS 16.0, *), ARWorldTrackingConfiguration.supportsFrameSemantics(.sceneDepth) {
            configuration.frameSemantics.insert(.sceneDepth)
        }
        session.run(configuration)
        isScanning = true
    }

    /// Stops the current AR session.
    public func stop() {
        session.pause()
        isScanning = false
    }

    /// Resets tracking and clears accumulated meshes.
    public func reset() {
        session.pause()
        meshAnchors.removeAll()
        session.run(ARWorldTrackingConfiguration(), options: [.resetTracking, .removeExistingAnchors])
    }

    public func session(_ session: ARSession, didAdd anchors: [ARAnchor]) {
        for anchor in anchors {
            if let mesh = anchor as? ARMeshAnchor {
                meshAnchors.append(mesh)
            }
        }
    }
}
#endif
