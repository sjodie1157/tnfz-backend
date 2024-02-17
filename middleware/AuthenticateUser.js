import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;

function createToken(user) {
    return sign({
        emailAdd: user.emailAdd,
        userPWD: user.userPWD
    },
        process.env.SECRET_KEY,
        {
            expiresIn: '1h'
        }
    )
}

function verifyAToken(req, res, next) {
    const token = req?.headers['Authorisation']
    if (token) {
        if (verify(token, process.env.SECRET_KEY)) {
            next()
        } else {
            res?.json({
                status: res.statusCode,
                msg: 'Incorrect User Details'
            })
        }
    } else {
        res?.json({
            status: res.statusCode,
            msg: 'Please Login'
        })
    }
}

export { createToken, verifyAToken };
