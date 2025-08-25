#if canImport(Vision)
import Vision
import CoreGraphics

/// Wrapper around a Core ML object detector.
public final class DetectionManager {
    public struct Detection {
        public let label: String
        public let confidence: Float
        public let boundingBox: CGRect
    }

    private let model: VNCoreMLModel?

    public init() {
        // TODO: supply lightweight Core ML model for sofa/tv/speaker/sub/avr/panel.
        self.model = nil
    }

    /// Performs detection on a pixel buffer. Falls back to manual tagging when no model is present.
    public func detect(in pixelBuffer: CVPixelBuffer, completion: @escaping ([Detection]) -> Void) {
        guard let model = model else {
            completion([])
            return
        }
        let request = VNCoreMLRequest(model: model) { request, _ in
            let results = (request.results as? [VNRecognizedObjectObservation]) ?? []
            let detections = results.map { obs in
                Detection(label: obs.labels.first?.identifier ?? "unknown",
                          confidence: Float(obs.confidence),
                          boundingBox: obs.boundingBox)
            }
            completion(detections)
        }
        let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up)
        try? handler.perform([request])
    }
}
#endif
