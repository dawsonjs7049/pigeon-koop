/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,

// }

const withTM = require('next-transpile-modules')([
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/core',
  '@fullcalendar/google-calendar',
  '@fullcalendar/interaction',
]);

module.exports = withTM({ reactStrictMode: true });
