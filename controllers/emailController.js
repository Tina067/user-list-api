import List from '../models/List.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

export const sendEmailToList = async (req, res) => {
  const { listId } = req.params;
  const { subject, body } = req.body;

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const users = await User.find({ listId });

    if (users.length === 0) {
      return res.status(400).json({ error: 'No users in the list' });
    }

    // Configure the email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tinamurmu333@gmail.com', // replace with your email
        pass: 'Pankaj@1', // replace with your email password
      },
    });

    // Send email to each user
    const emailPromises = users.map(user => {
      const personalizedBody = body.replace(/\[name\]/g, user.name)
                                   .replace(/\[email\]/g, user.email)
                                   .replace(/\[city\]/g, user.properties.city || '')
                                   .replace(/\[age\]/g, user.properties.age || '');

      return transporter.sendMail({
        from: 'tinamurmu333@gmail.com',
        to: user.email,
        subject: subject,
        text: personalizedBody,
      }).then(info => {
        console.log(`Email sent to ${user.email}: ${info.response}`);
        return { email: user.email, status: 'sent' };
      }).catch(error => {
        console.error(`Error sending email to ${user.email}: ${error.message}`);
        return { email: user.email, status: 'failed', error: error.message };
      });
    });

    const results = await Promise.all(emailPromises);
    res.status(200).json({ message: 'Emails sent successfully', results });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
