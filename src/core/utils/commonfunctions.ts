// Format duration in seconds to MM:SS format
export const formatDuration = (durationInSeconds: string | number): string => {
  const seconds = typeof durationInSeconds === 'string' ? parseFloat(durationInSeconds) : durationInSeconds;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
