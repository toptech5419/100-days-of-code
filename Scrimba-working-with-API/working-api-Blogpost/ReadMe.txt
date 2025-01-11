### **Key Notes on HTTP Concepts**

1. **HTTP Requests**  
   HTTP requests are how clients communicate with servers to fetch or send data over the web. Common methods include `GET`, `POST`, `PUT`, and `DELETE`.

   **Example**: Fetching posts from an API:  
   ```javascript
   fetch("https://jsonplaceholder.typicode.com/posts")
       .then(response => response.json())
       .then(data => console.log(data));
   ```

---

2. **Requests - URLs and Endpoints**  
   A URL (Uniform Resource Locator) specifies the address of a resource. An endpoint is a specific URL where an API provides access to its resources.

   **Example**:  
   URL: `https://jsonplaceholder.typicode.com/posts`  
   Endpoint: `/posts`

---

3. **Requests - Methods**  
   HTTP methods define the type of action to perform on the resource:
   - `GET`: Retrieve data.
   - `POST`: Create new data.
   - `PUT`: Update existing data.
   - `DELETE`: Remove data.

   **Example**: Sending a new post (`POST` method):  
   ```javascript
   fetch("https://jsonplaceholder.typicode.com/posts", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ title: "New Post", body: "Content here" }),
   }).then(response => response.json())
     .then(data => console.log(data));
   ```

---

4. **Requests - Body**  
   The body contains data sent to the server in `POST` or `PUT` requests, typically in JSON format.

   **Example**: Creating a new user:  
   ```javascript
   const user = { name: "John Doe", email: "john@example.com" };
   fetch("https://jsonplaceholder.typicode.com/users", {
       method: "POST",
       body: JSON.stringify(user),
       headers: { "Content-Type": "application/json" },
   });
   ```

---

5. **Requests - Headers**  
   Headers provide metadata about the request, such as content type or authorization.

   **Example**: Sending custom headers:  
   ```javascript
   fetch("https://jsonplaceholder.typicode.com/posts", {
       headers: {
           "Content-Type": "application/json",
           Authorization: "Bearer token123",
       },
   });
   ```

---

6. **REST (Representational State Transfer)**  
   REST is an architectural style for building APIs, using standard HTTP methods to perform CRUD (Create, Read, Update, Delete) operations on resources.

   **Example**: Fetching a user by ID:  
   ```javascript
   fetch("https://jsonplaceholder.typicode.com/users/1")
       .then(response => response.json())
       .then(data => console.log(data));
   ```

---

7. **REST API Design**  
   A well-designed REST API uses predictable URLs and supports CRUD operations with HTTP methods. For example:  
   - `GET /users` – Fetch all users.
   - `GET /users/1` – Fetch a specific user.
   - `POST /users` – Create a new user.

---

8. **Nested Resources**  
   Nested resources represent relationships, such as comments belonging to a specific post.

   **Example**: Fetching comments for a specific post:  
   ```javascript
   fetch("https://jsonplaceholder.typicode.com/posts/1/comments")
       .then(response => response.json())
       .then(data => console.log(data));
   ```

---

9. **URL Parameters - JSON Placeholder API**  
   URL parameters are placeholders in URLs to specify resources dynamically.  

   **Example**: Fetching a user by ID:  
   ```javascript
   fetch("https://jsonplaceholder.typicode.com/users/2")
       .then(response => response.json())
       .then(data => console.log(data));
   ```

---

10. **Query Strings**  
   Query strings pass additional data in the URL as key-value pairs, separated by `?` for the first pair and `&` for subsequent pairs.

   **Example**: Filtering posts by user ID:  
   ```javascript
   fetch("https://jsonplaceholder.typicode.com/posts?userId=1")
       .then(response => response.json())
       .then(data => console.log(data));
   ```

---

### **Summary**
These concepts form the foundation of working with APIs and HTTP. By combining methods, headers, body, and URL manipulation, you can create powerful, flexible interactions with web servers.