const User = require("../models/User");

const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  try {

    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
const updateAvatar = async (req,res)=>{
 try{

  const user = await User.findByIdAndUpdate(
   req.user._id,
   { avatar: req.file.filename },
   { new:true }
  );

  res.json(user);

 }catch(error){
  res.status(500).json({message:"Upload failed"});
 }
};
module.exports = { getProfile, updateProfile,updateAvatar };