/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mechanic-net.s3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'localhost',
      'https://mechanic.herokuapp.com',
      // 'https://mechanic-net.s3.eu-central-1.amazonaws.com',
    ],
  },
  env: {
    mapbox_key:
      'pk.eyJ1IjoiaGFsODciLCJhIjoiY2xjZGVyMDMwNnhtNTN3a2VlZWNrZG9jbyJ9.mos3-KYGU2Ibk88_STmJtw',
  },
  swcMinify: false,
}

module.exports = nextConfig
