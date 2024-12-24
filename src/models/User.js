const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    }
});

//middleware para encriptar contrase;a  antes de guardar 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

//compara contrase;a ingresada con almacenada
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);

};

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

module.exports = mongoose.model('User', userSchema);

