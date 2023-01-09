/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'https://mechanic.herokuapp.com'],
  },
  env: {
    mapbox_key:
      'pk.eyJ1IjoiaGFsODciLCJhIjoiY2xjZGVyMDMwNnhtNTN3a2VlZWNrZG9jbyJ9.mos3-KYGU2Ibk88_STmJtw',
  },
  swcMinify: true,
}

module.exports = nextConfig
