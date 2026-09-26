const API_URL = "http://127.0.0.1:8000";

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