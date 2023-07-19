export const calculateWPM = (time_taken, num_words) => {
  return time_taken > 0 ? (num_words / time_taken * 60).toFixed(0) : 0;
}

export const calculateAccuracy = (correct, wrong) => {
  return correct + wrong > 0 ? (correct / (correct + wrong) * 100).toFixed(1) : 0;
}

export const timeAgo = (curr_date) => {
  const seconds = Math.floor((new Date() - new Date(curr_date)) / 1000);
  // Year count
  const time_tables = [
    {label: 'year', div: 31536000},
    {label: 'month', div: 2592000},
    {label: 'day', div: 86400},
    {label: 'hour', div: 3600},
    {label: 'minute', div: 60}
  ];

  for(const table of time_tables) {
    const { label, div } = table
    const interval = seconds / div;
    if(interval >= 1) {
      return `${Math.floor(interval).toString()} ${label}${interval > 1 ? "s" : ""} ago`
    }
  }
  return "Just now";
}