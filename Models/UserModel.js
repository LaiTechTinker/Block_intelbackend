const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")

const UserSchema=mongoose.Schema({
name: {
      type: String,
      required: true,
      trim:true
    },
    email: {
      type: String,
      required: true,
      unique:true,
      trim:true,
      lowercase:true
    },
    password: {
      type: String,
      required: true,
    },
     profilePic: {
    type: String,
    default: 'https://share.google/images/nQUi89WkWTGzidqJ2'  // Default profile picture
  },
      isVerified: { type: Boolean, default: false },

},
 {
    timestamps: true,
  }
)
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const user=mongoose.model("User",UserSchema)
module.exports=user