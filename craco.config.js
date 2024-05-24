const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@material': path.resolve(__dirname, 'src/lib/components/material'),
            '@elements': path.resolve(__dirname, 'src/lib/components/common/elements'),
            '@layouts': path.resolve(__dirname, 'src/lib/components/common/layouts'),
            '@features': path.resolve(__dirname, 'src/lib/components/features'),
            '@providers': path.resolve(__dirname, 'src/lib/components/utility/providers'),
            '@themes': path.resolve(__dirname, 'src/lib/themes'),
            '@types': path.resolve(__dirname, 'src/lib/types'),
            '@utils': path.resolve(__dirname, 'src/lib/utils'),
            '@assets': path.resolve(__dirname, 'src/lib/assets'),
        },
    },
    jest: {
        configure: {
            moduleNameMapper: {
                '^@material(.*)$': '<rootDir>/src/lib/components/material$1',
                '^@elements(.*)$': '<rootDir>/src/lib/components/elements$1',
                '^@layouts(.*)$': '<rootDir>/src/lib/components/layouts$1',
                '^@features(.*)$': '<rootDir>/src/lib/components/features$1',
                '^@providers(.*)$': '<rootDir>/src/lib/components/utility/providers$1',
                '^@themes(.*)$': '<rootDir>/src/lib/themes$1',
                '^@types(.*)$': '<rootDir>/src/lib/types$1',
                '^@utils(.*)$': '<rootDir>/src/lib/utils$1',
                '^@assets(.*)$': '<rootDir>/src/lib/assets$1',
            },
        },
    },
};
