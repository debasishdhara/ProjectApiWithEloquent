// app/model/User.ts
export const modelName = 'User';

export const schema = {
  name: { type: 'STRING', allowNull: true },
  phone: { type: 'STRING', allowNull: true },
  email: { type: 'STRING', allowNull: false, unique: true },
  password: { type: 'STRING', allowNull: true },
  type: { type: 'INTEGER', allowNull: true },
};

export const tableName = 'users';        // optional
export const timestamps = true;          // optional
export const softDelete = true;          // optional
