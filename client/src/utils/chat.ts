export const getLastUserIndex = (messages: {role: string, content: string}[]): number => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      // Return the index if the object property "role" is equal to "user"
      return i;
    }
  }
  // Return -1 if no object property "role" is equal to "user"
  return -1;
};