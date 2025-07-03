import jwt from 'jsonwebtoken';

export const generateToken = (payload, secretKey, expiresIn = '1d') => {
    try {
        const token = jwt.sign(payload, secretKey, { expiresIn });
        return token;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error generating token:', error);
        }
        throw error;
    }
};


// Example usage:
// const token = generateToken({ userId: 123 }, 'yourSecretKey');
// console.log(token);