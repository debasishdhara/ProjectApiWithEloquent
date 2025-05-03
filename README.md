# ⚙️ Component CLI

This project supports custom CLI commands to **generate** and **delete** component scaffolding (Model, Controller, Service, Route) automatically.

---

## 📦 Generate a Component

Use the following command to create a new component:

```bash
npm run make:component <component-name>

Here's a clean and properly formatted `README.md` based on your description:

````markdown
# ⚙️ Component CLI

This project includes CLI scripts to **generate** and **delete** a full component structure (Model, Controller, Service, Route) using a single command.

---

## 📦 Generate a Component

Use the following command to **generate** a new component:

```bash
npm run make:component <component-name>
````

### Example

```bash
npm run make:component product
```

This will generate the following files:

```
app/
├── model/
│   └── Product.ts
├── controller/
│   └── productController.ts
├── service/
│   └── productService.ts
routes/
└── productRoutes.ts
```

> ✅ The component name is automatically formatted:
>
> * `PascalCase` for models
> * `camelCase` for other files

---

## 🗑 Delete a Component

Use the following command to **delete** a component:

```bash
npm run delete:component <component-name>
```

### Example

```bash
npm run delete:component product
```

This will delete all associated files for the `product` component.

---

## 🚫 Restrictions

* Component names must **not** be one of the following: `default`, `pbase`, `mbase`, `sbase`
* Deleting components is **irreversible**. Use with caution.

```

Let me know if you'd like to include route auto-registration or Swagger schema updates in the README as well.
```
