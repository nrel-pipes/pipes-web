/**
 * Gets the full name from a user object.
 * Falls back to email username if first_name and last_name are not available.
 *
 * @param {Object} user - The user object
 * @param {string} user.first_name - User's first name
 * @param {string} user.last_name - User's last name
 * @param {string} user.email - User's email address
 * @returns {string} The full name or email username
 */
export const getFullName = (user) => {
  if (!user) return 'N/A';

  // If both first_name and last_name exist, combine them
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`.trim();
  }

  // If only first_name exists
  if (user.first_name) {
    return user.first_name.trim();
  }

  // If only last_name exists
  if (user.last_name) {
    return user.last_name.trim();
  }

  // Fallback to email username (part before @)
  if (user.email) {
    const username = user.email.split('@')[0];
    // Convert email username to more readable format (e.g., jianli.gu -> Jianli Gu)
    return username
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  return 'N/A';
};
