import { User } from "../models/user.js";

const userRoutes = {
  async create(req, res) {
    try {
      const { fullName, firstName, lastName, hobby, email, password } =
        req.body;

        console.log(fullName, email, password);

      if (email === undefined)
        return res
          .status(400)
          .json({ error: true, reason: "Field 'email' is required" });
      if (password === undefined)
        return res
          .status(400)
          .json({ error: false, reason: "Field 'password' is required" });

      const existingEmail = await User.findOne({ email });  
      console.log(existingEmail);

      if (existingEmail !== null) {
        return res
          .status(200)
          .json({ error: true, reason: "User exist with this same email" });
      }

      let query = {};
      if (fullName !== undefined) query.fullName = fullName;
      if (firstName !== undefined) query.firstName = firstName;
      if (lastName !== undefined) query.lastName = lastName;
      if (email !== undefined) query.email = email;
      if (password !== undefined) query.password = password;
      if (hobby !== undefined) query.hobby = hobby;

      const user = await User.create(query);

      return res.status(200).json({ error: false, user });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  },

  async allUsers(req, res) {
    try {
      const { _id,isAdmin } = req.auth

      if(!isAdmin) {
        return res.status(400).json({ error: true, reason: "You are not admin" });
      }

      const authuser = await User.findById(_id).exec();
      console.log(authuser);

      if (authuser === null) {
        return res.status(400).json({ error: true, reason: "user not found" });
      }
      const users = await User.find();
      return res.status(200).json({ Error: false, users });
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  },

  async getUser(req, res) {
    try {
      const { _id, email } = req.auth;

      const user = await User.findOne({ _id: _id }).select("-password");
      if (user === null) {
        return res.status(400).json({ reason: "user not found" });
      }

      return res.status(200).json({ error: false, user });
    } catch (error) {
      return res.status(400).json({ Error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const { _id,isAdmin } = req.auth;
      const { id } = req.params

      if (!isAdmin) {
        return res.status(400).json({ reason: "You are not admin" });
      }

      const user = await User.findOne({ _id: id });
      if (user === null) {
        return res.status(400).json({ reason: "user not found" });
      }

      await User.deleteOne({ _id: id});

      return res.status(200).json({ error: false, isDelete: true });
    } catch (error) {
      return res.status(400).json({ Error: error.message });
    }
  },
};

export default userRoutes;
