// Nature-themed word banks for anonymous name generation
const adjectives = [
  'Calm', 'Drifting', 'Gentle', 'Serene', 'Floating',
  'Peaceful', 'Tranquil', 'Soft', 'Misty', 'Luminous',
  'Glowing', 'Shimmering', 'Wandering', 'Dancing', 'Flowing',
  'Quiet', 'Still', 'Dreamy', 'Ethereal', 'Graceful',
  'Radiant', 'Whispering', 'Blooming', 'Sleepy', 'Cozy'
];

const nouns = [
  'Jellyfish', 'Cloud', 'Wave', 'Sunset', 'Droplet',
  'Reef', 'Current', 'Tide', 'Moss', 'Pebble',
  'Shell', 'Coral', 'Mist', 'Breeze', 'Stream',
  'Lily', 'Lotus', 'Fern', 'Dew', 'Rain',
  'Moon', 'Star', 'Dawn', 'Dusk', 'Lagoon'
];

/**
 * Generate a random nature-themed anonymous display name
 * Format: "Adjective Noun" (e.g., "Calm Jellyfish")
 */
export function generateAnonymousName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}

/**
 * Generate a unique anonymous ID
 * Format: "adjective-noun-####" (e.g., "calm-jellyfish-7392")
 */
export function generateAnonymousId(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)].toLowerCase();
  const noun = nouns[Math.floor(Math.random() * nouns.length)].toLowerCase();
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${adjective}-${noun}-${numbers}`;
}
