export function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleString();
}

export function getTimeRemaining(endTime: string): string {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}

export function formatChance(chance: number): string {
  return `${(chance * 100).toFixed(1)}%`;
}

export function getRarityColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 'text-gray-600';
    case 'uncommon':
      return 'text-green-600';
    case 'rare':
      return 'text-blue-600';
    case 'legendary':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case 'Lith':
      return 'text-yellow-600';
    case 'Meso':
      return 'text-green-600';
    case 'Neo':
      return 'text-blue-600';
    case 'Axi':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 