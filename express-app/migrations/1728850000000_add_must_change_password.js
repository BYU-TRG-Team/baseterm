/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns(
    { schema: "identity", name: "user" },
    {
      must_change_password: {
        type: "boolean",
        notNull: true,
        default: false,
      },
    },
    { ifNotExists: true },
  );
};

exports.down = (pgm) => {
  pgm.dropColumns(
    { schema: "identity", name: "user" },
    ["must_change_password"],
    { ifExists: true },
  );
};
