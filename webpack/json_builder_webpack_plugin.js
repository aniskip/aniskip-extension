// eslint-disable-next-line import/no-extraneous-dependencies
const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    output: {
      type: 'string',
    },
    json: {
      type: 'object',
      additionalProperties: true,
    },
  },
  additionalProperties: false,
};

class JsonBuilderPlugin {
  options;

  json;

  constructor(options = {}) {
    validate(schema, options, { name: 'JsonBuilderPlugin' });
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('JsonBuilderPlugin', (compilation) => {
      const { output, json } = this.options;

      const jsonString = JSON.stringify(json);

      // eslint-disable-next-line no-param-reassign
      compilation.assets[output] = {
        source: () => jsonString,
        size: () => jsonString.length,
      };
    });
  }
}

module.exports = JsonBuilderPlugin;
