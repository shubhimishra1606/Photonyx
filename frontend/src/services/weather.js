const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export async function geocodeFarmLocation(location) {
  const params = new URLSearchParams({ name: location, count: '1', language: 'en', format: 'json' })
  const response = await fetch(`${GEOCODING_URL}?${params}`)
  if (!response.ok) throw new Error('Could not look up this location.')
  const data = await response.json()
  const result = data.results?.[0]
  if (!result) throw new Error('Location not found. Try a nearby town or district name.')

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    location: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
  }
}

export async function getFarmWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code',
    hourly: 'temperature_2m,precipitation_probability',
    forecast_hours: '24',
    timezone: 'auto',
  })
  const response = await fetch(`${FORECAST_URL}?${params}`)
  if (!response.ok) throw new Error('Weather forecast is currently unavailable.')
  return response.json()
}

export function describeWeatherCode(code) {
  if (code === 0) return 'Clear sky'
  if ([1, 2].includes(code)) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if ([45, 48].includes(code)) return 'Foggy'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow'
  if ([95, 96, 99].includes(code)) return 'Thunderstorm'
  return 'Current conditions'
}
