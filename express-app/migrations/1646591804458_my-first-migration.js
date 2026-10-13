/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createExtension("uuid-ossp", { ifNotExists: true });
  pgm.createSchema("identity", { ifNotExists: true });

  pgm.createTable(
    { schema: "identity", name: "user" },
    {
      user_id: {
        type: "uuid",
        notNull: true,
        primaryKey: true,
        default: pgm.func("uuid_generate_v4()"),
      },
      username: {
        type: "varchar",
        notNull: true,
        unique: true,
      },
      verified: {
        type: "boolean",
        notNull: true,
        default: false,
      },
      password: {
        type: "varchar",
        notNull: true,
      },
      email: {
        type: "varchar",
        notNull: true,
        unique: true,
      },
      name: {
        type: "varchar",
        notNull: true,
        unique: true,
      },
      role_id: {
        type: "integer",
        notNull: true,
      },
    },
    { ifNotExists: true },
  );

  pgm.createTable(
    { schema: "identity", name: "token" },
    {
      token: {
        type: "varchar",
        notNull: true,
        primaryKey: true,
      },
      user_id: {
        type: "uuid",
        notNull: true,
        references: '"identity"."user"',
        onDelete: "CASCADE",
      },
      type: {
        type: "varchar",
        notNull: true,
      },
      created_at: {
        type: "timestamptz",
        default: pgm.func("current_timestamp"),
      },
    },
    { ifNotExists: true },
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ schema: "identity", name: "token" }, { ifExists: true });
  pgm.dropTable({ schema: "identity", name: "user" }, { ifExists: true });
  pgm.dropSchema("identity", { ifExists: true, cascade: true });
};
