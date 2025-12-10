// utils/config.ts
export const getJwtConfig = () => {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    const accessExpiry = process.env.ACCESS_TOKEN_EXPIRY;
    const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY;
    if (!accessSecret || !refreshSecret || !accessExpiry || !refreshExpiry) {
        throw new Error('Missing JWT configuration in environment variables');
    }
    return {
        accessSecret,
        refreshSecret,
        accessExpiry,
        refreshExpiry
    };
};
//# sourceMappingURL=envConfig.js.map