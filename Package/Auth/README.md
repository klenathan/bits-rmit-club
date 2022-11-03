# How to use this package

## Import

```javascript
import AuthModule from "./Auth";
const {
  AuthRoutes,
  UserRoutes,
  verifyToken,
  verifyUserRole,
  initAuthModels,
  initUserRoutes,
  initAuthRoutes,
} = AuthModule;

// Call in models init
initAuthModels(db: Sequelize)

// Call in route registering
initUserRoutes(app: Application, db: Sequelize)
initAuthRoutes(app: Application, db: Sequelize)
```

## Main features:

## 1. Authentication middlewares

```javascript
const { verifyToken, verifyUserRole } = AuthModule;

// example of verify a user
app.use("/protected", verifyToken("access"), userController.route);

// example of verify a user with specific role
app.use(
  "/protected",
  verifyToken("access"),
  verifyUserRole("Admin"),
  adminController.route
);
```

## 2. Authentication routes

```javascript
const { AuthRoutes, UserRoutes } = AuthModule;

// Create new routes for managing users
// User CRUD
app.use("/user", new UserRoutes(this.db).route);

// Create new routes for authenticating users
// User signIn, refreshToken
app.use("/auth", new AuthRoutes(this.db).route);
```
