// MongoDB initialization script for Restaurant Management System
print('🍽️ Initializing Restaurant Database...');

// Switch to restaurant database
db = db.getSiblingDB('restaurant');

print('📊 Creating collections with validation...');

// Users Collection with schema validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email and is required"
        },
        password: {
          bsonType: "string",
          minLength: 6,
          description: "must be a string with minimum 6 characters and is required"
        },
        isActive: {
          bsonType: "bool",
          description: "must be a boolean"
        },
        isAdmin: {
          bsonType: "bool",
          description: "must be a boolean"
        }
      }
    }
  }
});

// Menu Collection with schema validation
db.createCollection('menus', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "price", "image", "desc", "addedBy"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        type: {
          bsonType: "string",
          enum: ["veg", "nonveg", "beverages"],
          description: "must be veg, nonveg, or beverages and is required"
        },
        price: {
          bsonType: "number",
          minimum: 0,
          description: "must be a positive number and is required"
        },
        originalPrice: {
          bsonType: "number",
          minimum: 0,
          description: "must be a positive number"
        },
        image: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        desc: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        rating: {
          bsonType: "number",
          minimum: 0,
          maximum: 5,
          description: "must be a number between 0-5"
        },
        popular: {
          bsonType: "bool",
          description: "must be a boolean"
        },
        isActive: {
          bsonType: "bool",
          description: "must be a boolean"
        },
        addedBy: {
          bsonType: "objectId",
          description: "must be an ObjectId and is required"
        }
      }
    }
  }
});

// Orders Collection with schema validation
db.createCollection('orders', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user", "items", "subtotal", "total"],
      properties: {
        user: {
          bsonType: "objectId",
          description: "must be an ObjectId and is required"
        },
        items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["menuItem", "name", "price", "quantity"],
            properties: {
              menuItem: {
                bsonType: "objectId",
                description: "must be an ObjectId and is required"
              },
              name: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              price: {
                bsonType: "number",
                minimum: 0,
                description: "must be a positive number and is required"
              },
              quantity: {
                bsonType: "number",
                minimum: 1,
                description: "must be at least 1 and is required"
              },
              image: {
                bsonType: "string",
                description: "must be a string"
              }
            }
          }
        },
        subtotal: {
          bsonType: "number",
          minimum: 0,
          description: "must be a positive number and is required"
        },
        deliveryFee: {
          bsonType: "number",
          minimum: 0,
          description: "must be a positive number"
        },
        total: {
          bsonType: "number",
          minimum: 0,
          description: "must be a positive number and is required"
        },
        status: {
          bsonType: "string",
          enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"],
          description: "must be a valid order status"
        },
        deliveryAddress: {
          bsonType: "string",
          description: "must be a string"
        },
        phoneNumber: {
          bsonType: "string",
          description: "must be a string"
        },
        notes: {
          bsonType: "string",
          description: "must be a string"
        }
      }
    }
  }
});

// Feedbacks Collection with schema validation
db.createCollection('feedbacks', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user", "name", "email", "visitDate", "recommend", "rating"],
      properties: {
        user: {
          bsonType: "objectId",
          description: "must be an ObjectId and is required"
        },
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email and is required"
        },
        phone: {
          bsonType: "string",
          description: "must be a string"
        },
        visitDate: {
          bsonType: "date",
          description: "must be a date and is required"
        },
        recommend: {
          bsonType: "string",
          enum: ["yes", "no"],
          description: "must be 'yes' or 'no' and is required"
        },
        rating: {
          bsonType: "number",
          minimum: 1,
          maximum: 5,
          description: "must be a number between 1-5 and is required"
        },
        suggestion: {
          bsonType: "string",
          maxLength: 300,
          description: "must be a string with max 300 characters"
        }
      }
    }
  }
});

print('🔍 Creating optimized indexes...');

// User indexes
db.users.createIndex({ "email": 1 }, { unique: true, name: "email_unique" });
db.users.createIndex({ "isActive": 1 }, { name: "isActive_index" });
db.users.createIndex({ "isAdmin": 1 }, { name: "isAdmin_index" });

// Menu indexes
db.menus.createIndex({ "type": 1 }, { name: "type_index" });
db.menus.createIndex({ "popular": 1 }, { name: "popular_index" });
db.menus.createIndex({ "isActive": 1 }, { name: "isActive_index" });
db.menus.createIndex({ "price": 1 }, { name: "price_index" });
db.menus.createIndex({ "rating": -1 }, { name: "rating_desc" });
db.menus.createIndex({ "addedBy": 1 }, { name: "addedBy_index" });

// Order indexes
db.orders.createIndex({ "user": 1 }, { name: "user_index" });
db.orders.createIndex({ "status": 1 }, { name: "status_index" });
db.orders.createIndex({ "createdAt": -1 }, { name: "createdAt_desc" });
db.orders.createIndex({ "user": 1, "status": 1 }, { name: "user_status_compound" });

// Feedback indexes
db.feedbacks.createIndex({ "user": 1 }, { name: "user_index" });
db.feedbacks.createIndex({ "rating": 1 }, { name: "rating_index" });
db.feedbacks.createIndex({ "recommend": 1 }, { name: "recommend_index" });
db.feedbacks.createIndex({ "createdAt": -1 }, { name: "createdAt_desc" });

print('✅ Database initialization completed successfully!');
print('📝 Collections created: users, menus, orders, feedbacks');
print('🔍 Indexes created for optimal query performance');
print('🎉 Restaurant Management System database is ready!');
print('');
print('🔑 Ready for admin user and menu seeding via seed-database.js script');
print('👨‍💼 Default admin credentials will be: admin@restaurant.com / admin123');
