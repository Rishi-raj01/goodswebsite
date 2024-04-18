const mongoose=require("mongoose")
const emailValidator=require('email-validator')
const crypto=require("crypto")
const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        required: [true,"enter valid email"],
        validate:function(){
            return emailValidator.validate(this.email);}
      },
      password: {
        type: String,
        required: true,
      },

      phone: {
        type: Number,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      profileimage:{
        type:String,
        default:'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Free-Image.png'
      },
      resettoken:{
        type:String,
        default:"",
       },
      role: {
        type:String,
      enum:['admin','user','restaurentowner','deliveryboy'],
      default:'user',
      },
    },
    { timestamps: true }
  );
  userSchema.pre('save', function () {
    this.confirmpassword=undefined;
 
});
  userSchema.methods.createresettoken = async function () {
    const token = crypto.randomBytes(32).toString('hex');
    //console.log("Generated reset token:", token);
    this.resettoken = token;
    console.log("resettoken from createresettokrn ",this.resettoken)
    await this.save();  //this is required ,warna nhi save hoga 
    return token;         //on the other thought why tf it need await/async and await this.save() when resetpasswordhandler doesnt need this???????
  };

  userSchema.methods.resetpasswordhandler= function(password,confirmpassword){
    this.password=password;
    this.confirmpassword=confirmpassword;
    this.resettoken=undefined;}
  const usermodel = mongoose.model('usermodel', userSchema);

  module.exports=usermodel;  