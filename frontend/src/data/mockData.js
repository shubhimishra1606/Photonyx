// Central mock data source for PlantDx.
// When the FastAPI backend is ready, this file's shape should mirror
// the real API responses so components don't need to change.

export const plants = [
  {
    id: 'tomato',
    name: 'Tomato',
    image: '🍅',
    healthyAppearance:
      'Deep green, evenly colored leaves with firm stems and no spotting, curling, or yellowing along the edges.',
    conditions: [
      {
        id: 'late-blight',
        name: 'Late Blight',
        severity: 'high',
        symptoms:
          'Dark, water-soaked patches on leaves that expand rapidly, often with a pale green border and white mold on the underside in humid conditions.',
        prevention:
          'Avoid overhead watering, space plants for airflow, and remove infected foliage as soon as it appears.',
      },
      {
        id: 'early-blight',
        name: 'Early Blight',
        severity: 'medium',
        symptoms:
          'Concentric brown rings forming a target-like pattern on lower, older leaves first.',
        prevention:
          'Rotate crops yearly, mulch soil to prevent splashback, and remove lower leaves that touch the ground.',
      },
      {
        id: 'leaf-mold',
        name: 'Leaf Mold',
        severity: 'medium',
        symptoms:
          'Pale yellow spots on the upper leaf surface with olive-green to grey fuzzy mold underneath.',
        prevention:
          'Improve greenhouse ventilation and reduce humidity around the canopy.',
      },
    ],
  },
  {
    id: 'apple',
    name: 'Apple',
    image: '🍎',
    healthyAppearance:
      'Glossy green leaves with smooth margins and uniform color from base to tip.',
    conditions: [
      {
        id: 'apple-scab',
        name: 'Apple Scab',
        severity: 'medium',
        symptoms:
          'Olive-green to brown velvety spots on leaves and fruit that later turn black and scabby.',
        prevention:
          'Rake and destroy fallen leaves in autumn, and prune for better light penetration.',
      },
      {
        id: 'cedar-apple-rust',
        name: 'Cedar Apple Rust',
        severity: 'medium',
        symptoms:
          'Bright orange-yellow spots on the upper leaf surface with tube-like structures underneath.',
        prevention:
          'Remove nearby juniper or cedar hosts and apply protective measures in early spring.',
      },
      {
        id: 'black-rot',
        name: 'Black Rot',
        severity: 'high',
        symptoms:
          'Purple-bordered spots on leaves that enlarge into brown lesions, with fruit developing black concentric rings.',
        prevention:
          'Prune out dead wood and cankers, and sanitize tools between cuts.',
      },
    ],
  },
  {
    id: 'potato',
    name: 'Potato',
    image: '🥔',
    healthyAppearance:
      'Sturdy upright stems with dark green compound leaves and no lesions.',
    conditions: [
      {
        id: 'potato-early-blight',
        name: 'Early Blight',
        severity: 'medium',
        symptoms:
          'Dark, target-shaped spots on older leaves that expand and cause yellowing around the lesion.',
        prevention:
          'Ensure adequate plant nutrition and avoid overhead irrigation late in the day.',
      },
      {
        id: 'potato-late-blight',
        name: 'Late Blight',
        severity: 'high',
        symptoms:
          'Irregular water-soaked lesions that turn brown-black, spreading quickly in cool, wet weather.',
        prevention:
          'Plant certified disease-free seed potatoes and destroy volunteer plants.',
      },
    ],
  },
  {
    id: 'corn',
    name: 'Corn',
    image: '🌽',
    healthyAppearance:
      'Tall, upright leaves in a uniform bright to deep green with no pustules or streaking.',
    conditions: [
      {
        id: 'common-rust',
        name: 'Common Rust',
        severity: 'medium',
        symptoms:
          'Small, cinnamon-brown pustules scattered across both leaf surfaces.',
        prevention:
          'Choose resistant hybrids and monitor fields closely during humid periods.',
      },
      {
        id: 'gray-leaf-spot',
        name: 'Gray Leaf Spot',
        severity: 'high',
        symptoms:
          'Rectangular tan to gray lesions that run parallel to leaf veins.',
        prevention:
          'Rotate away from corn for at least one season and manage crop residue.',
      },
    ],
  },
  {
    id: 'grape',
    name: 'Grape',
    image: '🍇',
    healthyAppearance:
      'Bright green, lobed leaves with no discoloration and firm, pliable texture.',
    conditions: [
      {
        id: 'black-rot-grape',
        name: 'Black Rot',
        severity: 'high',
        symptoms:
          'Small tan spots with dark borders on leaves, and shriveled black "mummified" berries.',
        prevention:
          'Remove mummified fruit and infected canes during dormant pruning.',
      },
      {
        id: 'leaf-blight',
        name: 'Leaf Blight',
        severity: 'medium',
        symptoms:
          'Irregular reddish-brown blotches that dry and cause premature leaf drop.',
        prevention:
          'Improve canopy airflow through leaf pulling and balanced fertilization.',
      },
    ],
  },
  {
    id: 'peach',
    name: 'Peach',
    image: '🍑',
    healthyAppearance:
      'Slender, glossy leaves in rich green with no curling or discoloration.',
    conditions: [
      {
        id: 'bacterial-spot',
        name: 'Bacterial Spot',
        severity: 'medium',
        symptoms:
          'Small, dark, angular spots on leaves that may fall out, leaving a shot-hole appearance.',
        prevention:
          'Plant resistant varieties and avoid excess nitrogen fertilization.',
      },
    ],
  },
  {
    id: 'pepper',
    name: 'Pepper',
    image: '🫑',
    healthyAppearance:
      'Broad, waxy, dark green leaves with strong stems and no wilting.',
    conditions: [
      {
        id: 'bacterial-spot-pepper',
        name: 'Bacterial Spot',
        severity: 'medium',
        symptoms:
          'Small water-soaked spots that turn brown with a yellow halo, often merging on heavily infected leaves.',
        prevention:
          'Use certified seed, avoid working in wet fields, and rotate crops.',
      },
    ],
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    image: '🍓',
    healthyAppearance:
      'Trifoliate leaves in bright green with serrated edges and no leaf scorch.',
    conditions: [
      {
        id: 'leaf-scorch',
        name: 'Leaf Scorch',
        severity: 'medium',
        symptoms:
          'Small purple spots merge into larger scorched-looking blotches across the leaf.',
        prevention:
          'Remove old infected leaves after harvest and space plants for airflow.',
      },
    ],
  },
  {
    id: 'cherry',
    name: 'Cherry',
    image: '🍒',
    healthyAppearance:
      'Smooth, dark green, serrated leaves that stay firm and unspotted through the season.',
    conditions: [
      {
        id: 'powdery-mildew',
        name: 'Powdery Mildew',
        severity: 'low',
        symptoms:
          'A white, powder-like coating on the leaf surface and young shoots.',
        prevention:
          'Prune for open canopy structure and avoid excess shade and nitrogen.',
      },
    ],
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    image: '🫐',
    healthyAppearance:
      'Small, oval, deep green leaves with a slight leathery texture and no reddening.',
    conditions: [
      {
        id: 'blueberry-leaf-spot',
        name: 'Leaf Spot',
        severity: 'low',
        symptoms:
          'Small circular reddish-brown spots scattered across mature leaves.',
        prevention:
          'Maintain good drainage and avoid overhead watering late in the day.',
      },
    ],
  },
]

// A flattened pool of possible predictions the mock model can "return".
// Each entry mirrors what a future FastAPI /predict endpoint would send back.
export const predictionPool = [
  {
    plant: 'Tomato',
    disease: 'Late Blight',
    isHealthy: false,
    confidence: 96.8,
    description:
      'Late blight is a fast-moving fungal-like disease that thrives in cool, wet weather. Left untreated, it can destroy an entire crop within days.',
    actions: [
      'Remove and destroy affected leaves immediately',
      'Avoid overhead irrigation to keep foliage dry',
      'Improve air circulation around plants',
      'Monitor nearby plants closely for spread',
    ],
  },
  {
    plant: 'Apple',
    disease: 'Apple Scab',
    isHealthy: false,
    confidence: 91.4,
    description:
      'Apple scab is a common fungal disease that affects leaves and fruit, causing dark velvety lesions that reduce yield and fruit quality.',
    actions: [
      'Rake and remove fallen leaves from around the tree',
      'Prune to increase airflow and sunlight penetration',
      'Apply protective treatment before wet spring periods',
      'Avoid planting new trees too close together',
    ],
  },
  {
    plant: 'Corn',
    disease: 'Common Rust',
    isHealthy: false,
    confidence: 94.2,
    description:
      'Common rust produces reddish-brown pustules on leaves. Moderate infections rarely kill the plant but can reduce photosynthesis and yield.',
    actions: [
      'Scout fields weekly during warm, humid weather',
      'Choose rust-resistant hybrids in future plantings',
      'Avoid excess nitrogen which can worsen severity',
      'Remove severely infected leaves where practical',
    ],
  },
  {
    plant: 'Potato',
    disease: 'Early Blight',
    isHealthy: false,
    confidence: 88.7,
    description:
      'Early blight typically appears on older, lower leaves first as dark concentric rings, gradually moving up the plant.',
    actions: [
      'Remove lower leaves that show early lesions',
      'Rotate planting location next season',
      'Ensure balanced potassium and nitrogen levels',
      'Water at the base rather than overhead',
    ],
  },
  {
    plant: 'Grape',
    disease: 'Black Rot',
    isHealthy: false,
    confidence: 89.9,
    description:
      'Black rot affects leaves, shoots, and fruit, causing tan lesions and shriveled, mummified berries if left unmanaged.',
    actions: [
      'Remove mummified berries and infected canes',
      'Apply protective measures before bloom',
      'Improve canopy airflow with leaf pulling',
      'Sanitize pruning tools between plants',
    ],
  },
  {
    plant: 'Pepper',
    disease: 'Bacterial Spot',
    isHealthy: false,
    confidence: 85.3,
    description:
      'Bacterial spot causes water-soaked lesions on leaves and fruit, spreading quickly in warm, wet conditions.',
    actions: [
      'Avoid overhead watering and handling wet plants',
      'Remove and discard heavily spotted leaves',
      'Rotate crops away from peppers next season',
      'Disinfect tools used near infected plants',
    ],
  },
  {
    plant: 'Tomato',
    disease: 'Healthy',
    isHealthy: true,
    confidence: 98.1,
    description:
      'No signs of disease were detected. The leaf shows healthy pigmentation, structure, and no visible lesions.',
    actions: [
      'Continue your current watering and care routine',
      'Keep monitoring weekly for early signs of stress',
      'Maintain good spacing for airflow',
      'Re-scan if any spotting or discoloration appears',
    ],
  },
  {
    plant: 'Apple',
    disease: 'Healthy',
    isHealthy: true,
    confidence: 97.5,
    description:
      'The leaf appears healthy with no visible signs of fungal or bacterial infection.',
    actions: [
      'Maintain your regular pruning schedule',
      'Keep an eye out after heavy rain periods',
      'Continue balanced fertilization',
      'Re-scan periodically through the growing season',
    ],
  },
  {
    plant: 'Corn',
    disease: 'Gray Leaf Spot',
    isHealthy: false,
    confidence: 52.4,
    description:
      'The model detected patterns consistent with gray leaf spot, but image clarity limited confidence in this result.',
    actions: [
      'Re-scan with the affected leaf centered and in focus',
      'Capture the image in even, natural lighting',
      'Avoid heavy blur or motion in the shot',
      'Consult a local expert if symptoms persist',
    ],
  },
]

// Recent / historical scans shown on the Dashboard and History pages.
export const scanHistory = [
  {
    id: 'scan-001',
    plant: 'Tomato',
    disease: 'Late Blight',
    isHealthy: false,
    confidence: 96.8,
    date: '2026-09-24',
    image: '🍅',
  },
  {
    id: 'scan-002',
    plant: 'Apple',
    disease: 'Healthy',
    isHealthy: true,
    confidence: 97.5,
    date: '2026-09-23',
    image: '🍎',
  },
  {
    id: 'scan-003',
    plant: 'Corn',
    disease: 'Common Rust',
    isHealthy: false,
    confidence: 94.2,
    date: '2026-09-22',
    image: '🌽',
  },
  {
    id: 'scan-004',
    plant: 'Potato',
    disease: 'Early Blight',
    isHealthy: false,
    confidence: 88.7,
    date: '2026-09-21',
    image: '🥔',
  },
  {
    id: 'scan-005',
    plant: 'Grape',
    disease: 'Black Rot',
    isHealthy: false,
    confidence: 89.9,
    date: '2026-09-19',
    image: '🍇',
  },
  {
    id: 'scan-006',
    plant: 'Tomato',
    disease: 'Healthy',
    isHealthy: true,
    confidence: 98.1,
    date: '2026-09-18',
    image: '🍅',
  },
  {
    id: 'scan-007',
    plant: 'Pepper',
    disease: 'Bacterial Spot',
    isHealthy: false,
    confidence: 85.3,
    date: '2026-09-17',
    image: '🫑',
  },
  {
    id: 'scan-008',
    plant: 'Strawberry',
    disease: 'Leaf Scorch',
    isHealthy: false,
    confidence: 79.6,
    date: '2026-09-15',
    image: '🍓',
  },
  {
    id: 'scan-009',
    plant: 'Cherry',
    disease: 'Healthy',
    isHealthy: true,
    confidence: 96.3,
    date: '2026-09-12',
    image: '🍒',
  },
  {
    id: 'scan-010',
    plant: 'Blueberry',
    disease: 'Leaf Spot',
    isHealthy: false,
    confidence: 82.1,
    date: '2026-09-10',
    image: '🫐',
  },
  {
    id: 'scan-011',
    plant: 'Corn',
    disease: 'Gray Leaf Spot',
    isHealthy: false,
    confidence: 52.4,
    date: '2026-09-08',
    image: '🌽',
  },
  {
    id: 'scan-012',
    plant: 'Peach',
    disease: 'Bacterial Spot',
    isHealthy: false,
    confidence: 90.7,
    date: '2026-09-05',
    image: '🍑',
  },
]

export const dashboardStats = {
  totalScans: 248,
  healthyPlants: 162,
  diseasesDetected: 86,
  modelAccuracy: 94.6,
}

export const currentUser = {
  name: 'Asha Verma',
  email: 'asha.verma@fieldmail.com',
  role: 'Agronomy Researcher',
  avatarInitials: 'AV',
}

export const modelInfo = {
  version: 'PlantDx v1.0',
  lastUpdated: '2026-08-30',
  defaultConfidenceThreshold: 60,
}
