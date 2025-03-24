const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const tokenSign = (user) => {
    const sign = jwt.sign(
        {
            _id: user._id
        },
        JWT_SECRET,
        {
            expiresIn: "2h"
        }
    )
    return sign
 }

 const verifyToken = (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, JWT_SECRET)
    }catch(err) {
        console.log(err)
    }
 }

 const refreshToken = (user) => {
    const refreshToken = jwt.sign(
        {
            _id: user._id
        },
        JWT_SECRET,
        {
            expiresIn: "7d" 
        }
    );
    return refreshToken;
}

const cookieOptions = () => {
    return {
        httpOnly: true, 
        secure: true,
        sameSite: 'Strict', 
        path: '/'
    };
}

const clearAuthCookie = (res) => {
    res.clearCookie('authToken', cookieOptions())
  }

 module.exports = { tokenSign, verifyToken, refreshToken, clearAuthCookie }