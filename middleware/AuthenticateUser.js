import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;

function createToken(user) {
    return sign({
        emailAdd: user.emailAdd,
        userPWD: user.userPWD
    }, process.env.SECRET_KEY, {
        expiresIn: '1h'
    });
}

export async function verifyAToken(req, res, next) {
    const token = req.headers['authorization']; 
    if (!token) {
        return res.status(401).json({
            status: 401,
            msg: 'Please Login'
        });
    }
    try {
        const decoded = verify(token, process.env.SECRET_KEY);
        next();
    } catch (error) {
        return res.status(403).json({ 
            status: 403,
            msg: 'Incorrect User Details'
        });
    }
}

export { createToken };
