const fs = require('fs').promises;
const path = require('path');

const postsFilePath = path.join(__dirname, '../data/posts.json');

async function getStoredPosts() {
  try {
    const fileData = await fs.readFile(postsFilePath);
    return JSON.parse(fileData);
  } catch (error) {
    return []; // Return an empty array if the file doesn't exist or there's an error
  }
}

async function storePosts(posts) {
  await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2));
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Respond to preflight request
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    const posts = await getStoredPosts();
    res.status(200).json({ posts });
  } else if (req.method === 'POST') {
    const existingPosts = await getStoredPosts();
    const newPost = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updatedPosts = [newPost, ...existingPosts];
    await storePosts(updatedPosts);

    res.status(201).json({ message: 'Post added successfully', post: newPost });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
