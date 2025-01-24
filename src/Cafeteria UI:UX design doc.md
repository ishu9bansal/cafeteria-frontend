### **UI/UX Design**

#### **Navbar**

- Positioned at the top of every page.
- Contains links to:
  - **Home** (list of counters)
  - **Cart** (shows items added by the customer)
  - **Profile** (shows user details like name, email, and role)
- Dynamic based on the user’s role:
  - Customers: Links to Home, Cart, and Profile.
  - Merchants: Links to Counters (similar to Home for Customers but only filtered Counters specific to the merchant) and Profile.
  - Admin: Links to Counters, Users and Profile. (Admin will have slightly different view with CRUD capabilities in Counters page, and similarly for Users page)

#### **Screens**

1. **Home Page**

   - Displays all **Counters** in a grid/list format.
   - Includes basic **search** and **filter** functionality for counters.
   - Clicking a counter navigates to its **details page**.

2. **Counter Details Page**

   - Shows the **list of dishes** for that counter.
   - Includes options to:
     - View **dish details** (modal or separate page - optional).
     - Add dishes to the **cart** (for customers).
   - For merchants:
     - Options to manage dishes (CRUD operations).
     - Options to view and edit the Counter details
   - For admins:
     - Links to assign/revoke merchants for that counter.

3. **Cart Page** (Customer only)

   - Displays the list of **dishes** added to the cart.
   - Allows users to update the **quantity** or remove dishes.
   - Total price calculation.
   - Checkout button (triggers order creation).

4. **Profile Page**

   - Shows basic user details like:
     - Name, email, and role.
   - Includes an option to log out or edit profile information.

5. **Admin Pages**

   - **Counters**: View and manage counters (CRUD operations)
   - **Users**: Assign/revoke roles, view user details.
   - Note: Admins cannot manage dishes, only merchant for the counter can do that.

6. **Merchant Pages**

   - Counters: Show only merchant's **assigned counters**.
   - Each Counter Details Page Shows:
     - Counter details.
     - List of dishes at the counter.
     - Options to **add/edit/remove** dishes.
     - **Orders**: View and manage pending orders, update order status.

---

### **Essential Features to Ensure a Smooth UX**

- **Feedback/Loading States:**
  - Show spinners or skeleton loaders when fetching data.
  - Toast notifications for successful/failed operations.
- **Error Handling:**
  - Handle API errors gracefully (e.g., "Counter not found" or "Dish is out of stock").
- **Responsive Design:**
  - Ensure the layout works seamlessly on desktop and mobile.
- **Role-Specific Views:**
  - Render UI components dynamically based on the user’s role.

---

### **Key Components**

Here’s a breakdown of reusable React components:

1. **Navbar:** Dynamic links based on the user’s role.
2. **CounterCard:** Represents a single counter in the list.
3. **DishCard:** Represents a single dish in the list.
4. **CartItem:** Displays a dish and its quantity in the cart.
5. **OrderItem:** Represents a single order in the order list.
6. **Pagination:** Reusable pagination component for counters, dishes, or orders.
