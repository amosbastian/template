export function getFirstPartOfEmail(email: string): string {
  const atIndex = email.indexOf("@");

  if (atIndex !== -1) {
    return email.slice(0, atIndex);
  }

  // If the '@' sign is not present (shouldn't be possible), return the entire email
  return email;
}
