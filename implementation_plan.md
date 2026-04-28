# Advanced DIP QR & Barcode Scanner Implementation Plan

This plan outlines the architecture and development steps for a professional, academic-grade QR and Barcode Scanner project focused on Digital Image Processing (DIP) concepts. 

## Project Architecture

The project will be split into two main components:
1. **Backend (Python)**: A FastAPI server that handles advanced image processing, decoding, and scan history storage.
2. **Frontend (React.js + Tailwind CSS)**: A modern, reactive dashboard built with Vite to handle live webcam feeds, image uploads, and beautifully display the processing steps.

### Directory Structure
```
dip workspace/
├── backend/
│   ├── main.py              # FastAPI server, endpoints
│   ├── dip_engine.py        # Core Image Processing logic (OpenCV, Pyzbar)
│   ├── database.py          # SQLite for storing scan history
│   └── requirements.txt     # Python dependencies
└── frontend/                # React Vite App
    ├── src/
    │   ├── components/      # UI Components (Webcam, Upload, Results, History)
    │   ├── pages/           # Dashboard, Scanner Pages
    │   ├── App.jsx          # Main App entry
    │   └── index.css        # Tailwind directives
    ├── tailwind.config.js   # Tailwind Configuration
    └── package.json         # Node dependencies
```

## Digital Image Processing (DIP) Core Pipeline

To heavily justify the project for academic evaluation and viva, the backend will not just decode the image but will pass it through a robust DIP pipeline. Furthermore, the API will return **intermediate processed images** (as Base64 strings) so the React frontend can display the step-by-step transformation to the examiners.

**The Pipeline (`dip_engine.py`):**
1. **Image Acquisition**: Receive image from upload or live webcam frame.
2. **Grayscale Conversion**: Convert to single channel (`cv2.cvtColor`).
3. **Histogram Equalization**: Enhance contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization) to handle low-light.
4. **Noise Removal**: Apply Gaussian Blur or Median Filtering to smoothen the image and reduce noise.
5. **Thresholding/Binarization**: Adaptive thresholding to separate foreground (barcode) from background.
6. **Edge Detection**: Canny Edge detection.
7. **Morphological Operations**: Dilation/Erosion to close gaps in code regions.
8. **Contour Detection & Segmentation**: Find contours (`cv2.findContours`) and segment the Region of Interest (ROI) bounding box.
9. **Decoding (Feature Extraction)**: Use Pyzbar on the processed ROI (or original ROI if extreme distortion).

## Frontend Design & UI (React + Tailwind CSS)

The frontend will be initialized using `npm create vite@latest frontend -- --template react` and styled exclusively with Tailwind CSS.
- **Aesthetics**: Premium dark theme with vibrant accent colors (e.g., neon blue/purple), glassmorphism effects (`backdrop-blur`, bg-opacity), and smooth Tailwind transitions.
- **Components**:
  - `Dashboard`: High-level stats, latest scans.
  - `WebcamScanner`: Utilizes `react-webcam` or native media APIs to capture frames and send to the backend.
  - `ImageUpload`: Drag-and-drop area styled with Tailwind.
  - `DIPVisualizer`: A grid component to display the 6-step DIP intermediate images returned by the backend.
  - `ScanHistory`: A tabular view of past scans with timestamps and export options.

## User Review Required

> [!IMPORTANT]
> - Is returning and displaying the intermediate DIP stages (Grayscale, Edge Detection, etc.) on the React UI a good approach for your Viva? (It usually significantly boosts marks for DIP projects).
> - Since you requested Tailwind CSS, we will ensure it's a very modern, responsive design. Is there a specific color theme you prefer (e.g., Dark Mode + Cyan, or Light Mode + Blue)?
> - Ensure you have Node.js, Python, and a webcam available for testing the live scanner.

## Proposed Changes

### Backend
- `backend/main.py`: Set up FastAPI app with CORS (to allow React requests), SQLite integration, and `/scan/upload`, `/scan/live`, `/history` endpoints.
- `backend/dip_engine.py`: Implement the `process_image` function executing the DIP pipeline and returning base64 images and decoded text.
- `backend/database.py`: Set up a simple `scans` table (id, decoded_data, code_type, timestamp).

### Frontend (React Setup)
- Run Vite creation script and install Tailwind CSS.
- Configure `tailwind.config.js` and `index.css`.
- Create the component structure and implement API fetching logic.

## Verification Plan
1. **Backend Tests**: Run Python server and send Postman/Curl requests to verify decoding and base64 generation.
2. **Frontend Tests**: Run `npm run dev` and open the React app in a browser. Test webcam permission, scan a live QR code, and verify the DIP visualizer displays the steps.
3. **Integration Tests**: Verify scan history is saved and fetched correctly.
