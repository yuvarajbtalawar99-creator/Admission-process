/**
 * Returns the current academic year dynamically in "YYYY – YYYY" format.
 * The academic year transitions on June 1st of every year.
 */
export const getAcademicYear = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed: 0 = Jan, 5 = June
  if (month >= 5) { // June or later
    return `${year} – ${year + 1}`;
  } else {
    return `${year - 1} – ${year}`;
  }
};
