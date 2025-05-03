Here’s an updated `README.md` section you can include to document your NPM scripts clearly and professionally:

---

## 📜 Available NPM Scripts

| Script                     | Description                                                           | Example Usage                      |
| -------------------------- | --------------------------------------------------------------------- | ---------------------------------- |
| `npm run start`            | Starts the application with Nodemon and ts-node.                      | `npm run start`                    |
| `npm run dev`              | Alias for `start`, useful for development.                            | `npm run dev`                      |
| `npm run make:component`   | Creates a new structure with Component, Controller, Model, Service and Route. | `npm run make:component Product`   |
| `npm run delete:component` | Deletes an existing component structure.                              | `npm run delete:component Product` |
| `npm run make:route`       | Generates full CRUD route handlers with Swagger docs.                 | `npm run make:route POST User`     |
| `npm run make:service`     | Generates a service file for business logic.                          | `npm run make:service UserService` |
| `npm run make:model`       | Creates a new database model file.                                    | `npm run make:model Product`       |
| `npm run make:controller`  | Creates a controller file (reuses model generator for now).           | `npm run make:controller Product`  |
| `npm run generate:key`     | Generates fresh JWT secret and refresh keys in `.env`.                | `npm run generate:key`             |
| `npm run make:auth`        | Sets up JWT or Passport authentication middleware and generates keys. | `npm run make:auth`                |

---

## 🔥 Quick Examples

### ➡️ Generate a JWT Secret Key

```bash
npm run generate:key
```

### ➡️ Create a Compact Component Structure

```bash
npm run make:component Product
```

### ➡️ Generate Routes (with Swagger)

**Singular route into `defaultRoutes.js`:**

```bash
npm run make:route GET User s
```

**Normal route (creates `OrderRoutes.js`):**

```bash
npm run make:route POST Order
```

### ➡️ Create a New Database Model

```bash
npm run make:model Product
```

### ➡️ Create a New Controller

```bash
npm run make:controller Product
```

### ➡️ Generate Authentication (JWT or Passport)

```bash
npm run make:auth
```

---

Would you like this content saved as a ready-to-paste `README.md` file?
