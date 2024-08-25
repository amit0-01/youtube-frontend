export const convertoMinute = (durationInSeconds: number): string => {
    // Calculate the number of minutes
    const minutes = Math.floor(durationInSeconds / 60);
    // Calculate the remaining seconds
    const seconds = Math.round(durationInSeconds % 60);
  
    // Format the result as "mm:ss" with leading zeros
    const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
    return formattedTime;
  };


  export function dateAgo(dateString: Date): string {
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
        year: 365 * 24 * 60 * 60,
        month: 30 * 24 * 60 * 60,
        week: 7 * 24 * 60 * 60,
        day: 24 * 60 * 60,
        hour: 60 * 60,
        minute: 60,
        second: 1,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const count = Math.floor(secondsAgo / secondsInUnit);
        if (count > 0) {
            return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}
  