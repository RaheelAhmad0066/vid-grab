import { PLATFORMS } from '../constants/platforms'

export const detectPlatform = (url) => {
  for (const platform of PLATFORMS) {
    if (platform.pattern.test(url)) {
      return platform
    }
  }
  return null
}
