const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
        token:{
            type: String,
            required: true
            }
        }
    ],
    resetToken: String,
    
    expireToken:Date,
});
userSchema.pre('save', async function (next) {
    
    if (this.isModified('password')) {
         this.password= await bcrypt.hash(this.password,12)
    };
    next();
})
 
//jwt
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }
    catch (err) {
        console.log(err);
    }
}

const User =mongoose.model('USER', userSchema);

module.exports = User;