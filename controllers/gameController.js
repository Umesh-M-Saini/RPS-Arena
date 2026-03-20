const User = require('../models/User');

async function completeMatch(req, res) {
  try {
    // 1. Validate outcome
    const { outcome } = req.body || {};

    if (!['win', 'lose', 'draw'].includes(outcome)) {
      return res.status(400).json({ ok: false, message: "Invalid outcome" });
    }

    // 2. Get user ID from middleware
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    // 3. Prepare update object
    const inc = {
      totalMatches: 1   // always increment
    };

    if (outcome === 'win') {
      inc.wins = 1;
      inc.points = 10;
    } 
    else if (outcome === 'lose') {
      inc.losses = 1;
    }

    // 4. Update DB
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $inc: inc },
      { new: true }   // return updated data
    );

    // 5. Response
    return res.json({
      ok: true,
      user: updatedUser
    });

  } catch (err) {
    console.error("Match Error:", err);
    return res.status(500).json({ ok: false, message: "Server Error" });
  }
}

module.exports = {
  completeMatch,
};