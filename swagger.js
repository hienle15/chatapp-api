import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const API_VERSION = process.env.API_VERSION;


export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Chat App API",
    version: "1.0.0",
    description: "API documentation for Chat App with JWT, Sequelize and Socket.IO",
  },
  servers: [
    {
      url: `http://${HOST}:${PORT}${API_VERSION}`,
      description: "Local development server",
    },
  ],
  paths: {
    "/users/register": {
      post: {
        summary: "Register new user",
        tags: ["User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  confirmPassword: { type: "string" }
                },
                required: ["name", "email", "password", "confirmPassword"]
              },
            },
          },
        },
        responses: {
          201: { description: "Account created successfully" },
          400: { description: "Invalid input" },
          409: { description: "Email already exists" }
        }
      }
    },
    "/users/login": {
      post: {
        summary: "Login user",
        tags: ["User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  // email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["name",  "password"]
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          400: { description: "Invalid credentials" }
        }
      }
    },
    "/users/logout": {
      get: {
        summary: "Logout user",
        tags: ["User"],
        responses: {
          200: { description: "Logged out successfully" }
        }
      }
    },
    "/users": {
      get: {
        summary: "Get all users except current logged in",
        tags: ["User"],
        // security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of other users" },
          500: { description: "Server error" }
        }
      }
    },
    "/message/send/{id}": {
      post: {
        summary: "Send message to user by ID",
        tags: ["Message"],
        // security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Receiver's user ID"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" }
                },
                required: ["message"]
              },
            },
          },
        },
        responses: {
          201: { description: "Message sent successfully" },
          500: { description: "Server error" }
        }
      }
    },
    "/message/{id}": {
      get: {
        summary: "Get all messages between current user and user by ID",
        tags: ["Message"],
        // security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID of other participant"
          }
        ],
        responses: {
          200: {
            description: "List of messages",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      senderId: { type: "integer" },
                      receiverId: { type: "integer" },
                      message: { type: "string" },
                      timestamp: { type: "string", format: "date-time" }
                    }
                  }
                }
              }
            }
          },
          500: { description: "Failed to fetch messages" }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  tags: [
    { name: "User", description: "User registration and login" },
    { name: "Message", description: "Message send and fetch" }
  ]
};
