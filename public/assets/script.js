let token = localStorage.getItem("authToken");

function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch("http://localhost:3001/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors[0].message);
      } else {
        alert("User registered successfully");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  fetch("http://localhost:3001/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Save the token in the local storage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId)
        token = data.token;

        alert("User Logged In successfully");

        // Fetch the posts list
        fetchPosts();

        // Hide the auth container and show the app container as we're now logged in
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function logout() {
  fetch("http://localhost:3001/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    // Clear the token from the local storage as we're now logged out
    localStorage.removeItem("authToken");
    token = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}

function fetchPosts() {
  fetch("http://localhost:3001/api/posts", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((posts) => {
      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";
      posts.forEach((post) => {
        const div = document.createElement("div");
        div.className = "blog-posts";


        div.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <p>Category: ${post.category ? post.category.categoryName : "Uncategorized"}</p>
        <small>Added by: ${post.user ? post.user.username : "Unknown"} on ${new Date(
          post.createdOn).toLocaleString()}</small>`;


        //EDIT button
        const editBtn = document.createElement("button");
        editBtn.className = "edit";
        editBtn.textContent = "EDIT";
        editBtn.addEventListener("click", async () => {
          const currentText = post.content;
          const currentTitle = post.title;
          const newTitle = prompt("Update the title:", currentTitle );
          const newText = prompt("Update the post:", currentText)

          if (newText !== null && newText.trim() !== "") {
            try {
              const response = await fetch(`/api/posts/${post.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title: newTitle, content: newText }),
              });

              if (response.ok) {
                fetchPosts();
              }
            }
            catch (error) {
              console.error("Error updating:", error);
            }
          }
        });
        // DELETE button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete";
        deleteBtn.textContent = "DELETE";
        deleteBtn.onclick = () => deletePost(post.id);
        const deletePost = async () => {
          if (confirm("Do you want to DELETE your blog post?")) {
            try {
              const response = await fetch(`/api/posts/${post.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
              });

              if (response.ok) {
                fetchPosts();  
              }
            }
            catch (error) {
              console.error("Error deleting:", error);
            }
          }
        };
        const div2 = document.createElement("div");
        div2.className = "buttons";

        postsContainer.appendChild(div);
        div2.appendChild(editBtn);
        div2.appendChild(deleteBtn);
        div.appendChild(div2);
      });
    });
}

function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const category_id = parseInt(document.getElementById("categoryName").value);
  const user_id = localStorage.getItem("user_id");

  if (!title || !content || !category_id) {
    alert("Please fill in all fields and choose a category!");
    return;
  }

 fetch("http://localhost:3001/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      title: title, 
      content: content, 
      category_id: category_id, 
      userId: parseInt(user_id) 
    }),  
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    })
    .then(() => {
      alert("Post created successfully");
      // Clear inputs
      document.getElementById("post-title").value = "";
      document.getElementById("post-content").value = "";
      document.getElementById("categoryName").value = "";
      // Refresh the feed
      fetchPosts();
    })
    .catch(err => console.error("Error:", err));
}