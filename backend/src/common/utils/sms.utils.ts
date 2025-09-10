/**
 * SMS utility functions for Persian text handling
 */

/**
 * Calculate the number of SMS units needed for Persian text
 * Persian SMS: 70 characters = 1 SMS unit
 * @param text The text message to calculate SMS count for
 * @returns Number of SMS units needed
 */
export function calculateSmsCount(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }
  
  // For Persian text, every 70 characters equals 1 SMS
  const characterCount = text.length;
  return Math.ceil(characterCount / 70);
}

/**
 * Get SMS count information for display purposes
 * @param text The text message
 * @returns Object with character count and SMS count
 */
export function getSmsInfo(text: string): {
  characterCount: number;
  smsCount: number;
  maxCharacters: number;
} {
  const characterCount = text?.length || 0;
  const smsCount = calculateSmsCount(text);
  const maxCharacters = 70; // Characters per SMS for Persian
  
  return {
    characterCount,
    smsCount,
    maxCharacters
  };
}
