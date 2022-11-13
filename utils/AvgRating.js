export const AvgRating = (obj) => {
  const reviews = Object.values(obj).map(({ rating }) => rating);
  if (reviews.length === 0) return 0;
  const totalRatings = reviews.reduce((acc, el) => acc + el, 0);
  return (totalRatings / reviews.length).toFixed(1);
};
