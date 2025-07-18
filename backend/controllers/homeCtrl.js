const User = require('../models/User');
const SleepLog = require('../models/SleepLog');


exports.addSleepLog = async (req, res) => {
  const { date, sleep_time, wake_time, mood } = req.body;
  const username = req.user.name; 
  console.log("POST /home/sleeplogs hit!");  
  if (!username) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await SleepLog.addSleepLog({ username, date, sleep_time, wake_time, mood });
    res.status(201).json({ message: 'Sleep log added' });
  } catch (error) {
    console.error('Error adding sleep log:', error);
    res.status(500).json({ message: 'Error adding sleep log' });
  }
};


exports.getSleepLogs = async (req, res) => {
  const username = req.user?.name;
  const { month } = req.query; 
  if (!username) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    let logs;
    if (month) {
      
      logs = await SleepLog.getSleepLogsByMonth(username, month);
    } else {
      
      logs = await SleepLog.getSleepLogsByUsername(username);
    }
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching sleep logs:', error);
    res.status(500).json({ message: 'Error fetching sleep logs' });
  }
};

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};
