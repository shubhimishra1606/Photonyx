# Photonyx: AI-Powered Plant Disease Detection & Advisory Platform

Photonyx is an AI-powered plant health platform designed to help users identify plant diseases from leaf images and receive practical guidance for managing affected crops.

---

## Features

### Plant Disease Detection
- AI-based plant disease classification using EfficientNet-B0.
- Designed to work with real-world leaf images in addition to controlled dataset images.

### Camera-Based Scanning
- Capture plant images directly using the device camera.
- Supports mobile and laptop camera input.
- Allows users to crop the relevant leaf before prediction.

### Leaf / Non-Leaf Validation
A separate validation stage is planned to prevent the disease classifier from predicting a disease when the uploaded image is not actually a leaf.

---

## Working
```text
Input Image
     ↓
Leaf / Non-Leaf Classifier
     ↓
     ├── Non-Leaf → Reject Image
     │                 ↓
     │          "Please upload a clear
     │           plant leaf image"
     │
     └── Leaf
          ↓
     Disease Classifier
          ↓
     Disease + Confidence
          ↓
     AI Advisory Engine
          ↓
     ┌─────────────────────────┐
     │ Remedy                  │
     │ Prevention              │
     │ Fertilizer Guidance     │
     │ Irrigation Guidance     │
     └─────────────────────────┘
          ↓
     Save Scan to History
```

---

##  Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS
* **Backend:** FastAPI, Python
* **Machine Learning:** PyTorch, EfficientNet-B0
* **Computer Vision:** OpenCV
* **AI & LLM Integration:** Gemini API / LLM API
* **Database & Auth:** Firebase (Firestore, Authentication)

---

## Model Limitations

Photonyx is an experimental AI-based plant health system and has several limitations.

### Dataset Bias
the model may perform differently on:

- Unusual lighting
- Severe blur
- Very small leaves
- Multiple overlapping leaves
- Unseen diseases
- Different plant varieties
- Highly complex backgrounds
- Confidence

Model confidence does not necessarily represent real-world diagnostic certainty.

A high-confidence prediction can still be incorrect when the input is outside the training distribution.

### Disease Coverage

The model currently supports a fixed set of 114 classes. Diseases outside these classes cannot be reliably identified.
