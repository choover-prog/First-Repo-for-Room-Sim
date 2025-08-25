import Foundation

/// Core data structures corresponding to `room.json` schema used by the web viewer.
public struct Room: Codable {
    public struct Info: Codable {
        public var L: Float
        public var W: Float
        public var H: Float
        public var origin: [Float]
        public var up: String
        public var scale_m: Float
        public init(L: Float, W: Float, H: Float, origin: [Float] = [0,0,0], up: String = "Y", scale_m: Float = 1.0) {
            self.L = L
            self.W = W
            self.H = H
            self.origin = origin
            self.up = up
            self.scale_m = scale_m
        }
    }

    public var room: Info
    public var objects: [RoomObject]
    public var mlp: MLP?
    public var mics: Mics?
    public var meta: Meta

    public init(room: Info, objects: [RoomObject], mlp: MLP? = nil, mics: Mics? = nil, meta: Meta) {
        self.room = room
        self.objects = objects
        self.mlp = mlp
        self.mics = mics
        self.meta = meta
    }
}

public struct RoomObject: Codable, Identifiable {
    public var id: String
    public var type: String
    public var role: String
    public var model_id: String
    public var transform: Transform
    public var size_m: [Float]
    public var confidence: Float
    public var user_verified: Bool
    public var source: String

    public init(id: String, type: String, role: String, model_id: String, transform: Transform, size_m: [Float], confidence: Float, user_verified: Bool = false, source: String) {
        self.id = id
        self.type = type
        self.role = role
        self.model_id = model_id
        self.transform = transform
        self.size_m = size_m
        self.confidence = confidence
        self.user_verified = user_verified
        self.source = source
    }
}

public struct Transform: Codable {
    public var pos: [Float]
    public var rot_euler: [Float]
    public var scale: [Float]

    public init(pos: [Float], rot_euler: [Float], scale: [Float] = [1,1,1]) {
        self.pos = pos
        self.rot_euler = rot_euler
        self.scale = scale
    }
}

public struct MLP: Codable {
    public var pos: [Float]
    public var yaw: Float
    public init(pos: [Float], yaw: Float) {
        self.pos = pos
        self.yaw = yaw
    }
}

public struct Mics: Codable {
    public var pattern: String
    public var points: [[Float]]
    public init(pattern: String, points: [[Float]]) {
        self.pattern = pattern
        self.points = points
    }
}

public struct Meta: Codable {
    public var device: String
    public var pipeline: String
    public var ts: Double
    public init(device: String, pipeline: String, ts: Double) {
        self.device = device
        self.pipeline = pipeline
        self.ts = ts
    }
}
