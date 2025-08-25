#if canImport(SwiftUI)
import SwiftUI

/// Lists detected objects and allows simple tagging.
public struct ReviewView: View {
    @Binding private var room: Room

    public init(room: Binding<Room>) {
        self._room = room
    }

    public var body: some View {
        List {
            ForEach(room.objects) { obj in
                HStack {
                    Text(obj.id).font(.headline)
                    Spacer()
                    Text(obj.role)
                }
            }
        }
        .navigationTitle("Review & Tag")
    }
}
#endif
