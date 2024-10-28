const router = require('express').Router();
const User = require('../models/User');

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a single user by Id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await Thought.deleteMany({ username: user.username });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Post to add a friend
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { $addToSet: { friends: req.params.friendId } });
    res.status(200).json({ message: 'Friend added' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete to remove a friend by 
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } });
    res.status(200).json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
