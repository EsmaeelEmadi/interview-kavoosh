const path = require('path');

module.exports = {
  webpack: {
    alias: {
      // '@': path.resolve(__dirname, 'src'),
      '@/material': path.resolve(__dirname, 'src/lib/components/material'),
      '@/elements': path.resolve(__dirname, 'src/lib/components/common/elements'),
      '@/layouts': path.resolve(__dirname, 'src/lib/components/common/layouts'),
      '@/providers': path.resolve(__dirname, 'src/lib/components/utility/providers'),
      '@/features': path.resolve(__dirname, 'src/lib/components/features'),
      '@/themes': path.resolve(__dirname, 'src/lib/themes'),
      '@/types': path.resolve(__dirname, 'src/lib/types'),
      '@/utils': path.resolve(__dirname, 'src/lib/utils'),
      '@/assets': path.resolve(__dirname, 'src/lib/assets'),
      '@/mock': path.resolve(__dirname, 'src/mock'),
    },
  },
};
