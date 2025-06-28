export function checkAge(birthDate: Date | string, minAge: number): boolean {
  if (!birthDate) return false;

  const date = new Date(birthDate);
  if (isNaN(date.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  return age >= minAge;
}
