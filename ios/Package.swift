// swift-tools-version: 6.1
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "RoomCaptureKit",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        // Core library that hosts capture, detection and export helpers.
        .library(
            name: "RoomCaptureKit",
            targets: ["RoomCaptureKit"]),
    ],
    targets: [
        .target(
            name: "RoomCaptureKit",
            path: "Sources/RoomCaptureKit"),
        .testTarget(
            name: "RoomCaptureKitTests",
            dependencies: ["RoomCaptureKit"],
            path: "Tests/RoomCaptureKitTests"
        ),
    ]
)
