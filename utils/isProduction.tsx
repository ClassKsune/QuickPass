export const isProduction = process.env.NODE_ENV === 'production';

export const getApplicationUrl = () =>
    isProduction ? 'https://quickpass.cz' : 'http://localhost:3000';

