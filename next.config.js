// const isProd = process.env.NODE_ENV === 'production';

// const withPWA = require('next-pwa');

// module.exports = withPWA({
//   pwa: {
//     disable: !isProd,
//     dest: 'public',
//   },
// });

const { withPlugins } = require('next-compose-plugins');
const withOptimizedImages = require('next-optimized-images');

// next.js configuration
const nextConfig = {
    reactStrictMode: true,
    images : {
      domains: [] //'aldea.com'
    },
    webpack: (config) => {
      config.experiments = { 
        asyncWebAssembly: true,
        topLevelAwait: true,
        layers: true
      }
      return config
    }
  };

module.exports = withPlugins([withOptimizedImages], nextConfig);






  