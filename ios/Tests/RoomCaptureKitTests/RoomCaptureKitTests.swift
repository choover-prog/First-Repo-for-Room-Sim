import XCTest
@testable import RoomCaptureKit

final class RoomCaptureKitTests: XCTestCase {
    func testRoomEncoding() throws {
        let room = Room(room: .init(L: 5, W: 4, H: 3),
                        objects: [],
                        meta: .init(device: "Test", pipeline: "arkit+roomplan", ts: 0))
        let data = try JSONEncoder().encode(room)
        XCTAssertFalse(data.isEmpty)
    }
}
