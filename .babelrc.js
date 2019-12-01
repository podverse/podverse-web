module.exports = {
  "plugins": [
    [
      "babel-plugin-root-import",
      {
        "rootPathSuffix": "./src"
      }
    ],
    [
      "transform-define"
    ]
  ],
  "env": {
    "development": {
      "presets": [
        "next/babel",
      ]
    },
    "production": {
      "presets": [
        "next/babel", 
      ]
    },
    "test": {
      "presets": [
        [
          "next/babel", 
          { 
            "preset-env": { 
              "modules": "commonjs"
            }
          }
        ]
      ]
    }
  }
}
