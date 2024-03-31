#!/usr/bin/env node
require('dotenv').config();

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
const connectDB = require('../db/index');
const { RelationShip } = require('../models/relationShip');

(async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Post.deleteMany({});
    await RelationShip.deleteMany({});

    console.log('Seeding admin...');
    const hashedPassword = await bcrypt.hash('123123*fF', 10);
    await User.create({
      email: 'admin@admin.com',
      username: 'admin',
      password: hashedPassword,
      avatar: faker.image.avatar(),
      followers: [],
      following: [],
      location: faker.location.city(),
      bio: faker.lorem.sentence(),
      birthday: faker.date.past(),
      website: faker.internet.url(),
      role: 'admin',
      savedPosts: [],
      isEmailVerified: true,
    });
    console.log('Seeding admin done!');

    console.log('Seeding users...');
    let users = [];
    for (let i = 0; i < 10; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      users.push({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: hashedPassword,
        avatar: faker.image.avatar(),
        followers: [],
        following: [],
        location: faker.location.city(),
        bio: faker.lorem.sentence(),
        birthday: faker.date.past(),
        website: faker.internet.url(),
        role: 'user',
        savedPosts: [],
        isEmailVerified: true,
      });
    }
    const createdUsers = await User.create(users);
    console.log('Seeding users done!');

    console.log('Seeding posts...');
    for (let user of createdUsers) {
      let posts = [];
      for (let i = 0; i < 5; i++) {
        posts.push({
          user: user._id,
          content: faker.lorem.sentence(),
          files: [faker.internet.url(), faker.internet.url()],
          likes: [],
          comments: [],
          view_count: Math.round(Math.random() * 100),
          is_pending: Math.random() < 0.5,
          is_public: Math.random() < 0.5,
        });
      }
      await Post.create(posts);
    }
    console.log('Seeding posts done!');

    console.log('Seeding relationships...');
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const friendIndex = (i + 1) % createdUsers.length;
      const friend = createdUsers[friendIndex];

      await RelationShip.create({
        follower: user._id,
        following: friend._id,
      });

      await User.findByIdAndUpdate(user._id, { $addToSet: { following: friend._id } });

      await User.findByIdAndUpdate(friend._id, { $addToSet: { followers: user._id } });
    }
    console.log('Seeding relationships done!');

    process.exit();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
