import List from '../models/List.js';
import User from '../models/User.js';
import { parseCSV } from '../utils/csvUtils.js';
import { sendEmail } from '../services/emailService.js';
import fs from 'fs';
import csv from 'csv-parser';

export const createList = async (req, res) => {
  const { title, properties } = req.body;
  const list = new List({ title, properties });
  await list.save();
  res.status(201).json(list);
};

export const addUsers = async (req, res) => {
  const { listId } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const list = await List.findById(listId);
  if (!list) {
    return res.status(404).send('List not found');
  }

  const results = [];
  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      const { added, errors } = await parseCSV(results, list);
      res.json({ added, errors, total: await User.countDocuments({ listId }) });
    });
};

