const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');
const mongoose = require('mongoose');
const config = require('../config/db'); // Make sure this is the correct path to your DB config

// Define the Mongoose schema for posts
const PostSchema = new mongoose.Schema({
  id: Number,
  title: String,
  score: Number,
  viewCount: Number,
  commentCount: Number,
  creationDate: Date,
  answerCount: Number,
  tags: [String],
  ownerUserId: Number
});

// Compile model from schema
const Post = mongoose.model('Post', PostSchema);

function processPost(post) {
  const processed = {
      id: Number(post.id),
      title: String(post.title),
      score: Number(post.score),
      viewCount: Number(post.viewCount),
      commentCount: Number(post.commentCount),
      creationDate: new Date(post.creationDate),
      answerCount: Number(post.answerCount),
      tags: post.tags ? post.tags.replace(/&lt;/g, '<').replace(/&gt;/g, '>').slice(1, -1).split('><') : [],
      ownerUserId: Number(post.ownerUserId)
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
    arrayMode: false, // single posts will not be put into arrays
  });
  const jsonData = parser.parse(data);
  let posts = jsonData.posts.post;
  if (!Array.isArray(posts)) {
    posts = [posts]; // Ensure posts is always an array
  }
  return posts; // The posts are now in the correct format
}

async function insertPosts(posts) {
  await mongoose.connect(config.MONGODB_URI);
  const processedPosts = posts.map(processPost); // Use the new processPost function
  await Post.insertMany(processedPosts);
  await mongoose.disconnect();
}

async function main() {
  const filePath = './data/exemples/posts.xml';
  try {
    const posts = await readXML(filePath);
    await insertPosts(posts);
    console.log('Posts inserted into the MongoDB database.');
  } catch (error) {
    console.error('Error processing XML or inserting into MongoDB:', error);
  }
}

main();

