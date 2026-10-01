from pathlib import Path

import timm
import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from torchvision import transforms

app = FastAPI(title="Photonyx API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MODELS_DIR = Path(__file__).resolve().parent / "models"
DISEASE_PATH = MODELS_DIR / "plantdx_efficientnet_b0.pth"
GATE_PATH = MODELS_DIR / "leaf_gate (1).pth"

LEAF_THRESHOLD = 0.50   # tune later on real test photos
CONF_THRESHOLD = 0.70   # tune later on real test photos


def load_model(path):
    ckpt = torch.load(path, map_location=device)
    m = timm.create_model(
        "efficientnet_b0",
        pretrained=False,
        num_classes=ckpt["num_classes"],
    )
    m.load_state_dict(ckpt["model_state_dict"])
    return m.to(device).eval(), ckpt["classes"]


# Load both models once, when the server starts
gate_model, gate_classes = load_model(GATE_PATH)
model, classes = load_model(DISEASE_PATH)
num_classes = len(classes)
LEAF_IDX = gate_classes.index("leaf")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])

print("Models loaded!")
print("Device:", device)
print("Gate classes:", gate_classes)
print("Disease classes:", num_classes)


@app.get("/")
def home():
    return {
        "message": "Photonyx API is running!",
        "device": str(device),
        "classes": num_classes,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file).convert("RGB")
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="Invalid image file")

    x = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        # Stage 1: is it a leaf?
        leaf_prob = torch.softmax(gate_model(x), dim=1)[0][LEAF_IDX].item()
        if leaf_prob < LEAF_THRESHOLD:
            return {
                "status": "not_a_leaf",
                "disease": None,
                "confidence": None,
                "leaf_prob": round(leaf_prob * 100, 2),
                "message": "This doesn't look like a plant leaf. Please upload a clear leaf photo.",
            }

        # Stage 2: disease prediction
        probabilities = torch.softmax(model(x), dim=1)

    confidence, predicted = torch.max(probabilities, 1)
    conf = confidence.item()

    # Stage 3: confidence check
    if conf < CONF_THRESHOLD:
        return {
            "status": "uncertain",
            "disease": None,
            "confidence": round(conf * 100, 2),
            "leaf_prob": round(leaf_prob * 100, 2),
            "message": "Not sure about this one. Please retake the photo in good light.",
        }

    return {
        "status": "ok",
        "disease": classes[predicted.item()],
        "confidence": round(conf * 100, 2),
        "leaf_prob": round(leaf_prob * 100, 2),
    }