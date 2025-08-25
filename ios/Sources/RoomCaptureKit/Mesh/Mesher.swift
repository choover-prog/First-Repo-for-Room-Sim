#if canImport(ARKit)
import ARKit
import ModelIO

/// Generates a triangle mesh from accumulated `ARMeshAnchor`s.
public final class Mesher {
    public init() {}

    /// Combines anchors into a single `MDLMesh`. Currently returns an empty mesh.
    public func buildMesh(from anchors: [ARMeshAnchor]) -> MDLMesh {
        // TODO: Implement mesh union & optional decimation for export.
        return MDLMesh()
    }
}
#endif
