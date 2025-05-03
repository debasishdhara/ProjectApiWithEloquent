
import { UserController } from '@controller/UserController';

// /users
// put
const userRoutes = {
    // /users for resources route in this file
    "/users": { // /users route
        "get": {
            "summary": "Get all users",
            "functions": [UserController.getUsers],
            "tags": ["Users"],
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "responses": {
                "200": {
                    "description": "List of users",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/User"
                                }
                            }
                        }
                    }
                }
            }
        },
        "post": {
            "summary": "Create a new user",
            "functions": [],
            "security": [],
            "tags": ["Users"],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/User"
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "User created",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/User"
                            }
                        }
                    }
                }
            }
        }

    },
    // registraion is under users route 
    "/registration": {
        "post": {
            "summary": "Create a new user",
            "functions": [UserController.createUser],
            "security": [],
            "tags": ["Users"],
            "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
            },
            "responses": {
                "200": {
                    "description": "User created",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/User"
                            }
                        }
                    }
                }
            }
        }
        // add new routes here
    }
}

export default userRoutes;
