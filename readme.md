# Full Stack Cooking Blog Application

## Description

This is a full-stack application featuring a robust backend with CRUD (Create, Read, Update, Delete) operations powered by a MySQL database. Users can register and log in to a secure environment where they can share their culinary posts. Each post is categorized for easy navigation, and the application ensures data integrity by allowing users to manage (edit or delete) only their own content.

## Key Features 

- **User Authentication**: secure **registration**, **login**, and **logout** functionality.
- **Dynamic CRUD Operations**: users can **create**, **update**, and **delete** their own blog posts.
- **Categorization**: all posts are linked to specific food categories (e.g., Breakfast, Dessert).
- **Responsive API**: a front-end interface that interacts seamlessly with a RESTful API to display live content.
- **Deployment**: fully deployed and hosted on Render.

## Instructions of running the application

1. **Setup the database**: open MySql on your terminal and set up database with the following command: mysql -u root -p. Make sure correct data is in .env file. 
2. **Install Dependencies**: run the command 'npm install'.
3. **Seed the Database**: populate the tables in the database with test data by running the command 'npm run seed'.
4. **Run the Application**: run the following terminal commands 'npm run dev' (for development with Nodemon) or 'npm start'.
5. **Access the App**: open your browser and navigate to: http://localhost:3001.

