import cv2
import numpy as np
import base64
from pyzbar.pyzbar import decode

def encode_image_base64(image):
    """Encodes an OpenCV image to a base64 string."""
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')

def process_image(image_bytes: bytes):
    """
    Core DIP pipeline.
    Takes image bytes, returns a dictionary of base64 encoded intermediate steps and decoded results.
    """
    # 1. Image Acquisition
    np_arr = np.frombuffer(image_bytes, np.uint8)
    original_img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    if original_img is None:
        return {"error": "Invalid image"}

    # We keep the original image for decoding because resizing destroys 1D barcode thin lines!
    original_gray = cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY)

    # Decode using the original resolution grayscale
    decoded_objects = decode(original_gray)
    
    # Fallback 1: Thresholded original
    if not decoded_objects:
        _, orig_thresh = cv2.threshold(original_gray, 100, 255, cv2.THRESH_BINARY)
        decoded_objects = decode(orig_thresh)

    # Fallback 2: CLAHE enhanced original (Good for barcodes in uneven lighting)
    if not decoded_objects:
        clahe_orig = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        orig_eq = clahe_orig.apply(original_gray)
        decoded_objects = decode(orig_eq)

    # Now we resize for the visual pipeline to ensure the UI doesn't lag or crash with huge images
    img = original_img.copy()
    max_dim = 800
    h, w = img.shape[:2]
    scale = 1.0
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        img = cv2.resize(img, (int(w * scale), int(h * scale)))

    pipeline_results = {}
    pipeline_results["original"] = encode_image_base64(img)

    # 2. Grayscale Conversion (Display)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    pipeline_results["grayscale"] = encode_image_base64(gray)

    # 3. Histogram Equalization (Display)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    equalized = clahe.apply(gray)
    pipeline_results["equalized"] = encode_image_base64(equalized)

    # 4. Noise Removal (Display)
    blurred = cv2.GaussianBlur(equalized, (5, 5), 0)
    pipeline_results["blurred"] = encode_image_base64(blurred)

    # 5. Thresholding / Binarization (Display)
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    pipeline_results["threshold"] = encode_image_base64(thresh)

    # 6. Edge Detection (Display)
    edges = cv2.Canny(blurred, 50, 150)
    pipeline_results["edges"] = encode_image_base64(edges)

    # 7. Morphological Operations (Display)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
    morph = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)
    pipeline_results["morphology"] = encode_image_base64(morph)

    # 8. Contour Detection (Display)
    contours, _ = cv2.findContours(morph, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contour_img = img.copy()
    cv2.drawContours(contour_img, contours, -1, (0, 255, 0), 2)
    pipeline_results["contours"] = encode_image_base64(contour_img)

    results = []
    annotated_img = img.copy()

    # Create a set to avoid duplicate detections if any
    seen_data = set()

    for obj in decoded_objects:
        data = obj.data.decode("utf-8")
        if data in seen_data:
            continue
        seen_data.add(data)
        
        code_type = obj.type
        results.append({"data": data, "type": code_type})
        
        # Scale bounding box down for the annotated image
        pts = obj.polygon
        if len(pts) > 4:
            hull = cv2.convexHull(np.array([point for point in pts], dtype=np.float32))
            hull = list(map(tuple, np.squeeze(hull)))
        else:
            hull = pts
            
        n = len(hull)
        for j in range(0, n):
            pt1 = (int(hull[j][0] * scale), int(hull[j][1] * scale))
            pt2 = (int(hull[(j+1) % n][0] * scale), int(hull[(j+1) % n][1] * scale))
            cv2.line(annotated_img, pt1, pt2, (255, 0, 255), 3)
            
        x, y, w_box, h_box = obj.rect
        cv2.putText(annotated_img, str(data), (int(x * scale), int((y * scale) - 10)), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    pipeline_results["final_annotated"] = encode_image_base64(annotated_img)

    return {
        "success": True,
        "scans": results,
        "pipeline": pipeline_results
    }
