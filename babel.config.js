module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "module:react-native-dotenv",
      [
        "rewrite-require",
        {
          aliases: {
            joi: "joi-react-native",
          },
        },
      ],
    ],
  };
};
