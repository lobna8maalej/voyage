import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// =======================
// REGISTER
// =======================

export const register = async (req, res) => {

  try {

    const email = req.body.email.toLowerCase().trim();


    // Vérifier email existant

    const userExist = await User.findOne({ email });


    if (userExist) {

      return res.status(400).json({
        message: "Email already exists",
      });

    }



    // Hash password

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      10
    );



    // Création utilisateur

    const user = await User.create({

      username: req.body.name.trim(),

      email,

      password: hashedPassword,

      role: "user"

    });





    // Création token

    const token = jwt.sign(

      {
        id:user._id,
        email:user.email,
        role:user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn:"7d"
      }

    );





    res.status(201).json({

      user:{

        id:user._id,

        username:user.username,

        email:user.email,

        role:user.role

      },

      token

    });



  } catch(error) {


    res.status(500).json({

      message:error.message

    });


  }

};






// =======================
// LOGIN
// =======================

export const login = async (req,res)=>{


  try{


    const email = req.body.email.toLowerCase().trim();



    const user = await User.findOne({email});



    if(!user){


      return res.status(404).json({

        message:"User not found"

      });


    }




    const isMatch = await bcrypt.compare(

      req.body.password,

      user.password

    );




    if(!isMatch){


      return res.status(400).json({

        message:"Wrong password"

      });


    }






    const token = jwt.sign(

      {

        id:user._id,

        email:user.email,

        role:user.role

      },

      process.env.JWT_SECRET,

      {

        expiresIn:"7d"

      }

    );







    res.json({

      user:{


        id:user._id,

        username:user.username,

        email:user.email,

        role:user.role


      },


      token


    });



  }catch(error){


    res.status(500).json({

      message:error.message

    });


  }


};







// =======================
// UPDATE USER
// =======================

export const updateUser = async(req,res)=>{


  try{


    const user = await User.findByIdAndUpdate(

      req.params.id,

      {

        email:req.body.email,

        username:req.body.username

      },

      {
        new:true
      }

    );




    if(!user){


      return res.status(404).json({

        message:"User not found"

      });


    }



    res.json(user);



  }catch(error){


    res.status(500).json({

      message:error.message

    });


  }


};