// app/model/User.ts
export const modelName = 'User';

export const schema = {
  name: { type: 'STRING', allowNull: false },
  phone: { type: 'STRING', allowNull: false },
  email: { type: 'STRING', allowNull: false, unique: true },
  password: { type: 'STRING', allowNull: false },
};

export const tableName = 'users';        // optional
export const timestamps = true;          // optional
export const softDelete = true;          // optional
