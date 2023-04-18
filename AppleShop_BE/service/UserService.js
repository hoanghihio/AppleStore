
const UserModel = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (email, password) => {
    //1. tìm user theo email: Select email, password, name, id form ursers where email = email and password = password
    //2. So sánh password
    //3. Trả về user nếu đúng, null nếu sai
    const user = await UserModel.findOne({ email });
    // kiểm tra password đã má hóa 
    if (user && bcrypt.compareSync(password, user.password)) {
        return user;
    }
    return null;
}

const register = async (fullname, email, password, confirm_password, mobile) => {
    //1. tạo user mới'
    //2. Lưu user mới
    //3. Trả về user mới
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = new UserModel({ fullname, email, password: hash, confirm_password, mobile });
    await user.save();
    return user;
}

const update = async (id, fullname, age, gender, dateofbirth, city, address  ) => {
    const user = await UserModel.findById(id);
    const model = await UserModel.findByIdAndUpdate(id,
        { fullname, age, gender, dateofbirth, city, address  });
    return model;
}

const forgotPassword = async (email) => {
    // 1. Tìm user theo email
    // 2. Nếu tìm thấy user thì tạo token mới
    // 3. Cập nhật token mới cho user
    // 4. Trả về user có token
    const user = await UserModel.findOne({ email });
    if (user) {
        const token = jwt.sign({ id: user._id }, 'shhhhh', { expiresIn: 5 * 60 });
        user.resetPassword = token;
        await user.save();
        return token;
    }
    return null;
};

const get = async (id) => {
    const user = await UserModel.findById(id);
    return user;
};

const TokenresetPassword = async (token, password) => {
    //1. Tìm user theo token
    //2. so sánh token
    //3. Nếu token hợp lệ thì cập nhật password mới 
    //4. Trả về user
    const user = await UserModel.findOne({ resetPassword: token });
    //console.log(user);
    if (user) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        user.password = hash;
        user.resetPassword = null;
        await user.save();
        return true;
    }
        return false;
};


module.exports = { login, register, update, forgotPassword, get, TokenresetPassword };
