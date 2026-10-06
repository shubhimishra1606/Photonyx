const API_URL = "http://127.0.0.1:8000";

export function wakeBackend() {
  fetch(`${API_URL}/`, { mode: "no-cors" }).catch(() => {});
}

export async function askPlantAdvice(payload) {
  const response = await fetch(`${API_URL}/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Could not get advice. Please try again.");
  }
  return data;
}

export async function getSupportedPlants() {
  const response = await fetch(`${API_URL}/plants`);
  if (!response.ok) throw new Error('Could not load plants supported by the model.');
  const data = await response.json();
  return data.plants || [];
}

export async function predictDisease(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Prediction failed");
  }

  const data = await response.json();

  if (data.status && data.status !== "ok") {
  return {
    rejected: true,
    status: data.status,
    message: data.message,
  };
}

  const parts = data.disease.split("___");

  const plant = parts[0]
    .replaceAll("_", " ")
    .replaceAll(",", "");

  const disease = parts[1]
    ? parts[1].replaceAll("_", " ")
    : data.disease;

  const isHealthy = disease.toLowerCase() === "healthy";

  return {
    plant,
    disease,
    confidence: data.confidence,
    isHealthy,
    description: isHealthy
      ? "The model detected a healthy plant leaf."
      : "The model detected signs associated with this plant disease.",
    actions: [],
    fileName: imageFile?.name ?? "unknown.jpg",
    timestamp: new Date().toISOString(),
  };
}
