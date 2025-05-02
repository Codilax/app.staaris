
const isProd = process.env.NODE_ENV === 'production';
const internalHost = process.env.TAURI_DEV_HOST || 'localhost';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output:'export',
    images: {
        unoptimized: true,
      },

      webpack:(
        config, {isProd},
      ) => { return {...config, optimization:{
        minimize:false
      }} },
      
      // Configure assetPrefix or else the server won't properly resolve your assets.
      assetPrefix: isProd ? undefined : `http://${internalHost}:3000`,
};

export default nextConfig;
