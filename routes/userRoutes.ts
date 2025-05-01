import { RouteFileExports } from '.';

const userRoutes: RouteFileExports = {
  "/users": {
    get: {
      summary: "Get all users",
      functions: [],
      tags: ["Users"],
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: "List of users",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/User"
                }
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Create a new user",
      functions: [],
      tags: ["Users"],
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User"
            }
          }
        }
      },
      responses: {
        201: {
          description: "User created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User"
              }
            }
          }
        }
      }
    }
  }
};

export default userRoutes;
