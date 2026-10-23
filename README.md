# Assignment 5 — Sequelize

## Setup
1. Make sure MySQL is running (for example, in XAMPP).
2. Create the database:
   ```sql
   CREATE DATABASE assignment5;
   ```
3. Copy `.env.example` to `.env` and update the database credentials.
4. Install and start:
   ```bash
   npm install
   npm start
   ```
   Sequelize creates the tables and associations automatically.

## Endpoints
Base URL: `http://localhost:3000`

### Users
- `POST /users/signup` — body: `{"name":"Ahmed","email":"ahmed@example.com","password":"secret123"}`
- `PUT /users/:id` — create/update by primary key; body contains user fields (validation intentionally skipped per assignment).
- `GET /users/by-email?email=ahmed@example.com`
- `GET /users/:id` — response excludes role and password.

### Posts
- `POST /posts` — body: `{"title":"First post","content":"Hello","userId":1}`
- `DELETE /posts/:postId` — body: `{"userId":1}`; only owner can delete.
- `GET /posts/details`
- `GET /posts/comment-count`

### Comments
- `POST /comments` — body must be an array, e.g.
  ```json
  [
    {"content":"First comment","postId":1,"userId":1},
    {"content":"Another comment","postId":1,"userId":2}
  ]
  ```
- `PATCH /comments/:commentId` — body: `{"userId":1,"content":"updated"}`
- `POST /comments/find-or-create` — body: `{"postId":1,"userId":1,"content":"Hello"}`
- `GET /comments/search?word=the`
- `GET /comments/newest/:postId`
- `GET /comments/details/:id`

## Postman
Create and save requests with meaningful names, then export the collection and include its link when submitting. A Postman collection is not included because it must be exported from your own Postman workspace.

## Notes
- `Post` uses `paranoid: true`, so `destroy()` soft-deletes it.
- The password is stored as plain text here only to match the assignment's basic model requirements. For a real application, hash passwords before saving.
- `PUT /users/:id` intentionally uses `validate: false` because the assignment explicitly requests skipping validation.
