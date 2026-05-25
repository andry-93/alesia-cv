import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'query', key: 'lang', value: 'ru' }],
        destination: '/ru',
        permanent: true
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'lang', value: 'en' }],
        destination: '/',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
