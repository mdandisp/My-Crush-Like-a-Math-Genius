import { charactersData } from '../data/mockData';

/**
 * Maps an array of backend topics to frontend characters consistently.
 * It filters the characters by target gender, sorts topics to maintain consistency,
 * and distributes characters among the topics using a modulo operation.
 */
export function mapTopicsToCharacters(topics: any[], targetGender: 'cewe' | 'cowo') {
  if (!topics || !Array.isArray(topics)) return [];

  // 1. Filter characters by gender
  const availableChars = charactersData.filter(c => c.type === targetGender);
  
  if (availableChars.length === 0) return [];

  // 2. Sort topics consistently (e.g. by created_at or id) so the mapping doesn't shuffle
  const sortedTopics = [...topics].sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return a.id.localeCompare(b.id);
  });

  // Track unmatched topics for fallback round-robin
  let unmatchedCount = 0;

  // 3. Map each topic to a character
  return sortedTopics.map((topic) => {
    const topicNameLower = (topic.name || '').toLowerCase();
    
    // Coba pasangkan berdasarkan kata kunci (konsep)
    let matchedChar = availableChars.find(c => topicNameLower.includes(c.concept.toLowerCase()));
    
    // Jika tidak ada kata yang cocok, pakai sistem berurutan
    if (!matchedChar) {
      matchedChar = availableChars[unmatchedCount % availableChars.length];
      unmatchedCount++;
    }
    
    return {
      ...matchedChar,
      topicId: topic.id,
      topicName: topic.name,
      topicMaxAttempts: topic.max_attempts,
      topicLevelSettings: topic.level_settings,
    };
  });
}

/**
 * Helper to find a specific character for a given topic ID
 */
export function getCharacterForTopic(topicId: string, topics: any[], targetGender: 'cewe' | 'cowo') {
  const mapped = mapTopicsToCharacters(topics, targetGender);
  return mapped.find(m => m.topicId === topicId) || null;
}
