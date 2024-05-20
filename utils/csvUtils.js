import User from '../models/User.js';

export async function parseCSV(rows, list) {
  const added = [];
  const errors = [];

  for (const row of rows) {
    const { name, email, ...customProps } = row;

    if (!name || !email) {
      errors.push({ row, error: 'Name and email are required' });
      continue;
    }

    const existingUser = await User.findOne({ email, listId: list._id });
    if (existingUser) {
      errors.push({ row, error: 'Duplicate email' });
      continue;
    }

    const properties = new Map();
    for (const prop of list.properties) {
      properties.set(prop.title, customProps[prop.title] || prop.defaultValue);
    }

    const user = new User({ name, email, listId: list._id, properties });
    try {
      await user.save();
      added.push(user);
    } catch (error) {
      errors.push({ row, error: error.message });
    }
  }

  return { added, errors };
}
