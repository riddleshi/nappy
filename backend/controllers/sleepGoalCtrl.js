const User = require('../models/User');

exports.getSleepGoal = async (req, res) => {
  try {
    const username = req.user?.name; 
    const goal = await User.getSleepGoal(username);
    res.json({ sleep_goal_hours: goal });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sleep goal' });
  }
};

exports.updateSleepGoal = async (req, res) => {
  try {
    const username = req.user.name;
    const { sleep_goal_hours } = req.body;
    await User.updateSleepGoal(username, sleep_goal_hours);
    res.json({ message: 'Sleep goal updated!' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating sleep goal' });
  }
};