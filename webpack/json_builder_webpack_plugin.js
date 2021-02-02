// eslint-disable-next-line import/no-extraneous-dependencies
const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    filename: {
      type: 'string',
    },
    json: {
      type: 'object',
      additionalProperties: true,
    },
  },
};

class JsonBuilderPlugin {
  options;

  constructor(options = {}) {
    validate(schema, options, { name: 'JsonBuilderPlugin' });
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'JsonBuilderPlugin',
      (compilation, callback) => {
        const json = JSON.stringify(this.options.json);

        // eslint-disable-next-line no-param-reassign
        compilation.assets[this.options.filename] = {
          source: () => json,
          size: () => json.length,
        };

        callback();
      }
    );
  }
}

module.exports = JsonBuilderPlugin;
