const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');
const mongoose = require('mongoose');
const config = require('../config/db');
const User = require('../api/models/user');


function processUser(user) {
    const processed = {
        id: Number(user.id),
        displayName: String(user.displayName),
        reputation: Number(user.reputation),
        creationDate: new Date(user.creationDate),
        location: String(user.location),
        aboutMe: user.aboutMe ? user.aboutMe.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : ""
    };
    return processed;
}

async function readXML(filePath) {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  const parser = new XMLParser({
    attributeNamePrefix: "",
    ignoreAttributes: true,
    parseAttributeValue: true,
    parseNodeValue: true,
    trimValues: true,
    arrayMode: false, // single users will not be put into arrays
  });
  const jsonData = parser.parse(data);
  let users = jsonData.users.user;
  if (!Array.isArray(users)) {
    users = [users]; // Ensure users is always an array
  }
  return users; // The users are now in the correct format
}

async function insertUsers(users) {
    await mongoose.connect(config.MONGODB_URI);
    for (const user of users) {
      const processedUser = processUser(user);
      await User.updateOne({ id: processedUser.id }, processedUser, { upsert: true });
    }
    await mongoose.disconnect();
}

async function main() {
  const filePath = './data/exemples/users.xml'; // Adjust the path as necessary
  try {
    const users = await readXML(filePath);
    await insertUsers(users);
    console.log('Users inserted into the MongoDB database.');
  } catch (error) {
    console.error('Error processing XML or inserting into MongoDB:', error);
  }
}

main();
