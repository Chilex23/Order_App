export const AvgRating = (arr) => {
  if (arr.length === 0) return 0;
  const totalRatings = arr.reduce((acc, el) => acc + el.rating, 0);
  return (totalRatings / arr.length).toFixed(1);
};
