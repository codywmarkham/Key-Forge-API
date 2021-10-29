const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(15);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account updated");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("Don't Have Permission");
    }
  });
  
  
  router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account Deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("Lack Permissions To Delete");
    }
  });
  
  
  router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
  router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("Following");
        } else {
          res.status(403).json("Already Following");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("Not Allowed To Follow Self");
    }
  });
  
  
  router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("Unfollowing");
        } else {
          res.status(403).json("Not Following");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("Not Allowed To Unfollow Self");
    }
  });
  
  
  
module.exports = router