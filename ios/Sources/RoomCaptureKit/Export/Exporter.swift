import Foundation

/// Exports the captured mesh as `scan.glb` and metadata as `room.json`.
public final class Exporter {
    public init() {}

    /// Writes scan.glb and room.json into the given directory.
    /// - Parameters:
    ///   - room: Room description matching the web viewer schema.
    ///   - meshData: Binary GLB data for the room mesh.
    ///   - directory: Destination directory.
    /// - Returns: URLs of the written GLB and JSON files.
    public func export(room: Room, meshData: Data = Data(), to directory: URL) throws -> (glb: URL, json: URL) {
        let jsonURL = directory.appendingPathComponent("room.json")
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        let jsonData = try encoder.encode(room)
        try jsonData.write(to: jsonURL)

        let glbURL = directory.appendingPathComponent("scan.glb")
        // TODO: Replace placeholder with actual GLB generation.
        try meshData.write(to: glbURL)

        return (glbURL, jsonURL)
    }
}
