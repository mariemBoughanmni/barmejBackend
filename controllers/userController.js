const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const nodemailer = require("nodemailer");
const { response } = require("express");
const User = require("../models/User");


const changePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;
  try {
    let checkIfPasswordMatch = await bcrypt.compare(password, user.password);
    if (!checkIfPasswordMatch) throw new Error();
    const updateQuery = {
      $set: {
        password: bcrypt.hashSync(newPassword, 12),
      },
    };
    let updated = await UserModel.findOneAndUpdate(
      { _id: user._id },
      updateQuery
    );
    res.status(200).json(updated)
  } catch (error) {
    throw error;
  }
};

const Register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).lean();
    if (user) throw new Error("user already exists");
    let registredUser = new UserModel(req.body);
    registredUser.password = bcrypt.hashSync(password, 12);
    const savedUser = await registredUser.save();
    await sendMail(savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};
async function sendMail({ email }) {
  console.log(email)
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'olfa.jlali@esprit.tn',
      pass: '213JFT61155'
    }
  });

  var mailOptions = {
    from: 'olfa.jlali@esprit.tn',
    to: email,
    subject: 'Thank you for creating an account in our application',
    text: 'click on this link to verify your account http://localhost:3000/users/verifyAccount/' + email
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


const verifyAccount = async (req, res, next) => {
  try {
    const { email } = req.params;
    console.log(email)
    const user = await UserModel.findOneAndUpdate({
      email
    }, {
      $set: {
        verified: true
      }
    })
    res.status(200).json(user);
  }
  catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}


const getAllUsers = async (req, res, next) => {
  try {
    let users = await UserModel.find().lean();
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const profile = async (req, res, next) => {
  try {
    const { user } = req;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await UserModel.findOneAndUpdate({ _id: id },
      req.body, { returnNewDocument: true })
    res.status(200).json(updatedUser)
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}

const forgetPassword = async (req, res, next) => {
  const {
    email
  } = req.body;
  const generatedCode = Math.floor(1000 + Math.random() * 9000)
  const user = await UserModel.findOneAndUpdate({
    email
  }, {
    $set: {
      codeOtp: generatedCode
    }

  });
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'olfa.jlali@esprit.tn',
      pass: '213JFT61155'
    }
  });

  var mailOptions = {
    from: 'olfa.jlali@esprit.tn',
    to: email,
    subject: 'new password',
    text: 'thank you for using our reset password service \n' + 'your code is' + generatedCode
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json({
        message: "check your email for the password"
      })
    }
  })
}
const changePasswordWhenForgot = async (req, res, next) => {
  const { email, code } = req.body;
  const generatedPass = "yournewpassword";
  try {
    const renderedUser = await UserModel.findOne({ email });
    if (renderedUser?.codeOtp != parseInt(code)) {
      throw new Error("wrong code");
    }
    const updateQuery = {
      $set: {
        password: bcrypt.hashSync(generatedPass, 12),
        codeOtp: Math.floor(1000 + Math.random() * 9000),
      },
    };
    let updated = await UserModel.findOneAndUpdate(
      { _id: renderedUser._id },
      updateQuery
    );
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'olfa.jlali@esprit.tn',
        pass: '213JFT61155'
      }
    });

    var mailOptions = {
      from: 'olfa.jlali@esprit.tn',
      to: email,
      subject: 'reset password',
      text: 'thank you for using our reset password service \n' + 'your new password is ' + generatedPass
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json({
          message: "check your email for the password"
        })
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};


const searchPartner = async (req, res, next) => {
  let searchQuery = {}
  const { search } = req.query
  if (search) {
    searchQuery = {
      ...searchQuery,
      $or: [
        { favsport: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ],
    }
  }
  if(parseInt(search)){
    searchQuery = {
      $or: [
        { favsport: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { age: { $eq: parseInt(search) } },
      ],
    }
  }
  let data = await User.find(searchQuery);
  res.send(data);
}

const filterUsers = async(req, res, next) => {
  const {
    location,favsport, age
  } = req.body;
  let filterQuery =  []
  try{
    if(location){
      filterQuery= [
        ...filterQuery,
        {location}
      ]
    }
    if(favsport){
      filterQuery= [
        ...filterQuery,
        {favsport}
      ]
    }
    if(age){
      filterQuery= [
        ...filterQuery,
        {age}
      ]
    }
    const users = await User.find({$and: filterQuery})
    res.status(200).json(users);
  }catch(err){
    res.status(500).json({
      message: err.message
    })
  }
}



module.exports = {
  Register,
  verifyAccount,
  changePassword,
  getAllUsers,
  profile,
  editProfile,
  forgetPassword,
  changePasswordWhenForgot,
  searchPartner,
  filterUsers
};
