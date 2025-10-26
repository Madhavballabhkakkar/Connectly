module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    ['@babel/plugin-transform-private-methods', {loose: true}],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@color': './src/styles/color.tsx',
          '@dimensions': './src/styles/dimensions.tsx',
          '@images': './src/assets/images',
          '@constants': './src/styles/constants.tsx',
          '@Utils': './src/utils/Utils.js',
          '@Navigator': './src/utils/Navigator.js',
          '@Helper': './src/utils/Helper.tsx',
          '@components': './src/components',
          '@redux': './src/redux',
          '@screens': './src/screens',
          '@api': './src/api',
          '@client': './src/api/client.tsx',
          '@queries': './src/api/queries.tsx',
          '@AsyncStoreHelper': './src/utils/AsyncStoreHelper.tsx',
        },
      },
    ],
  ],
};
