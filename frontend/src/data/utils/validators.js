const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export function validateImageFile(file) {
  if (!file) {
    return { valid: false, message: 'No file selected.' }
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: 'Unsupported file type. Please upload a JPG, JPEG or PNG image.',
    }
  }
  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      message: 'File is too large. Maximum size is 10MB.',
    }
  }
  return { valid: true, message: '' }
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
