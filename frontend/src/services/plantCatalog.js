import { plants as localPlants } from '../data/mockData'
import { getSupportedPlants } from './api'

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

export async function loadPlantCatalog() {
  const supportedPlants = await getSupportedPlants()

  return supportedPlants.map((supportedPlant) => {
    const localPlant = localPlants.find((plant) => (
      plant.id === supportedPlant.id || normalize(plant.name) === normalize(supportedPlant.name)
    ))

    const conditions = supportedPlant.conditions.map((condition) => {
      const localCondition = localPlant?.conditions.find((item) => (
        normalize(item.name) === normalize(condition.name)
      ))
      return { ...condition, ...localCondition, id: condition.id }
    })

    return {
      ...supportedPlant,
      name: localPlant?.name || supportedPlant.name,
      image: localPlant?.image || '🌿',
      healthyAppearance: localPlant?.healthyAppearance ||
        'Photonyx can recognize this crop. The model-supported condition labels are listed below.',
      conditions,
    }
  })
}
