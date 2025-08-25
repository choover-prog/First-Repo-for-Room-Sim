#if canImport(ARKit) && canImport(Vision)
import ARKit
import Vision

/// Lifts 2D detections into oriented 3D boxes using depth/mesh information.
public struct BackProjector {
    public init() {}

    /// Computes a rough 3D transform for a detected object.
    /// - Returns: `Transform` in meters, Y-up coordinate system.
    public func project(_ detection: DetectionManager.Detection,
                        frame: ARFrame) -> Transform? {
        // TODO: Use sceneDepth or mesh intersection to estimate 3D position and size.
        return nil
    }
}
#endif
