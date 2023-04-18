
const UserService = require('../service/UserService');
const mailer = require('nodemailer');
const getConstant = require('../utlis/constanst').getConstant;
const jwt = require('jsonwebtoken');

const register = async (fullname, email, password, confirm_password, mobile) => {
    const fullnameRegex = /^([A-ZĐÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰ][a-zđáàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữự]+\s)+[A-ZĐÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰ][a-zđáàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữự]+$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10,}$/;
    const passwordRegex = /^[A-Za-z0-9]+$/;
    if (!fullnameRegex.test(fullname)) {
        throw new Error('Họ tên không hợp lệ');
    }

    if (!emailRegex.test(email)) {
        throw new Error('Email không hợp lệ');
    }

    if (!passwordRegex.test(password)) {
        throw new Error('Mật khẩu không hợp lệ');
    }

    if (password !== confirm_password) {
        throw new Error('Mật khẩu và xác nhận mật khẩu không khớp');
    }

    if (!mobileRegex.test(mobile)) {
        throw new Error('Số điện thoại không hợp lệ');
    }

    const user = await UserService.register(fullname, email, password, confirm_password, mobile);
    return user;
};

const login = async (email, password) => {
    const user = await UserService.login(email, password);
    return user;
}


const update = async (id, fullname, age, gender, dateofbirth, city, address) => {
    try {
        const user = await UserService.update(id, fullname, age, gender, dateofbirth, city, address);
        return user;
    } catch (error) {
        console.log(error);
    }
}

const get = async (id) => {
    try {
        const user = await UserService.get(id);
        return user;
    } catch (error) {
        console.log(error);
    }
};

const transporter = mailer.createTransport({
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: getConstant().MAIL, //email: xuanhoang@gmail.com
        pass: getConstant().APP_PASSWORD// chuỗi password:  alhnktndyhbfiubf
    },
});

const forgotPassword = async (email) => {
    const token = await UserService.forgotPassword(email);
    if (token) {
        const mailOptions = {
            from: getConstant().MAIL, // gửi từ email nào 
            to: email,
            subject: 'Reset Password',
            html: `<a href="http://localhost:3000/users/cpanel/reset-password?token=${token}">Reset Password</a>`
        };
        await transporter.sendMail(mailOptions);
        return true;
    }
    return false;
};

const checkResetPasswordToken = async (token) => {
    const data = jwt.verify(token, 'shhhhh');
    if (data && data.id) {
        return true;
    }
    return false;
};

const resetPassword = async (token, password, confirm_password) => {
    if (password !== confirm_password) {
        throw new Error('Dữ liệu không chính xác');
    }
    console.log(token);
    const data = jwt.verify(token, 'shhhhh');
    if (data && data.id) {
        const result = await UserService.TokenresetPassword(token, password);
        return result;
    }
    return false;
};

module.exports = { register, login, update, get, forgotPassword, checkResetPasswordToken, resetPassword };


