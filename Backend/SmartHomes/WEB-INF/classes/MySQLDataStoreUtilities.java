import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.*;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class MySQLDataStoreUtilities {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/SmartHomes";
    private static final String USER = "root"; // replace with your MySQL username
    private static final String PASSWORD = "root"; // replace with your MySQL password

    // Method to register a new user
    public boolean registerUser(String name, String email, String password, int roleId) {
        String query = "INSERT INTO UserDetails (name, emailid, password, role_id) VALUES (?, ?, ?, ?)";
        
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, name);
            preparedStatement.setString(2, email);
            preparedStatement.setString(3, password);
            preparedStatement.setInt(4, roleId);
            int rowsAffected = preparedStatement.executeUpdate();
            return rowsAffected > 0; // return true if registration was successful
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // registration failed
        }
    }

    // Method to check if the user exists and retrieve user details
    public String loginUser(String email, String password, int roleId) {
        String query = "SELECT name FROM UserDetails WHERE emailid = ? AND password = ? AND role_id = ?";
        
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, email);
            preparedStatement.setString(2, password);
            preparedStatement.setInt(3, roleId);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getString("name"); // return the user's name
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null; // user not found
    }

    // Method to check if the email already exists
    public boolean isUserExists(String email) {
        String query = "SELECT COUNT(*) FROM UserDetails WHERE emailid = ?";
        
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, email);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt(1) > 0; // return true if email exists
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false; // email does not exist
    }


public static List<Map<String, Object>>  getAllUsers() {
        List<Map<String, Object>>  users = new ArrayList<>();
        
        try {
            Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
            String query = "SELECT user_id, name, emailid FROM userdetails where role_id=1";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
			Map<String, Object> user = new HashMap<>();
                user.put("user_id", resultSet.getInt("user_id"));
                user.put("name", resultSet.getString("name"));
                user.put("emailid", resultSet.getString("emailid"));
                users.add(user);
            }

            resultSet.close();
            preparedStatement.close();
            connection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return users;
    }



public int getUserId(String username) {
        String query = "SELECT user_id FROM UserDetails WHERE name = ?";
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, username);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt("user_id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1; // Return -1 if user not found
    }

public static List<Store> getAllStores() {
        List<Store> stores = new ArrayList<>();
        
        try {
            Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
            String query = "SELECT StoreID, Street, City, State, ZipCode FROM Stores";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                Store store = new Store();
                store.setStoreID(resultSet.getInt("StoreID"));
                store.setStreet(resultSet.getString("Street"));
                store.setCity(resultSet.getString("City"));
                store.setState(resultSet.getString("State"));
                store.setZipCode(resultSet.getString("ZipCode"));
                stores.add(store);
            }

            resultSet.close();
            preparedStatement.close();
            connection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return stores;
    }

public String getStoreAddress(int storeid) {
        String address="";
        String query = "SELECT Street,City,State,ZipCode FROM Stores WHERE StoreID = ?";
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setInt(1, storeid);
            ResultSet rs = preparedStatement.executeQuery();
            if (rs.next()) {
                String Street = rs.getString("Street");
                String city = rs.getString("City");
                String state = rs.getString("State");
                String zipcode = rs.getString("ZipCode");
			address=Street+","+city+","+state+","+zipcode;
                return address;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return address; 
    }


public int getCategoryID(String categoryName) {
        String query = "SELECT CategoryID FROM ProductCategory WHERE CategoryName = ?";
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, categoryName);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt("CategoryID");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1; // Return empty string if category name not found
    }

public String getCategoryName(int categoryID) {
        String query = "SELECT CategoryName FROM ProductCategory WHERE CategoryID = ?";
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setInt(1, categoryID);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getString("CategoryName");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ""; // Return empty string if category name not found
    }




public static List<Map<String, Object>> getProductCategories() {
        List<Map<String, Object>> categories = new ArrayList<>();
        try {
 		 Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);           
            String selectCategoriesQuery = "SELECT CategoryID, CategoryName FROM ProductCategory";
            PreparedStatement pst = conn.prepareStatement(selectCategoriesQuery);
            ResultSet rs = pst.executeQuery();
            
            while (rs.next()) {
                Map<String, Object> category = new HashMap<>();
                category.put("categoryId", rs.getInt("CategoryID"));
                category.put("categoryName", rs.getString("CategoryName"));
                categories.add(category);
            }
            rs.close();
            pst.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return categories;
    }

public boolean productaccessoryExists(String AccessoryName) {
        String query = "SELECT COUNT(*) FROM Accessories WHERE accessory_name = ?";
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, AccessoryName);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }


public boolean addProductAccessory(int productid,String AccessoryName,Double price, String imagePath) {
        String query = "INSERT INTO Accessories (ProductID, accessory_name, accessory_price, accessoryPath) VALUES (?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, productid);
            stmt.setString(2, AccessoryName);
            stmt.setDouble(3, price);
            stmt.setString(4, imagePath);
            return stmt.executeUpdate() > 0; // Returns true if the insert was successful
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }



public boolean productExists(String productName) {
        String query = "SELECT COUNT(*) FROM Products WHERE ProductName = ?";
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, productName);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

public boolean addProduct(String productName,String ManufacturerName, String categoryName, String description,String price, String imagePath, String specialDiscounts,String Rebates) {
        String query = "INSERT INTO Products (ProductName, CategoryID, Description, Price, ImagePath, Discounts, ManufacturerName,Rebates) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, productName);
            stmt.setString(2, categoryName);
            stmt.setString(3, description);
            stmt.setString(4, price);
            stmt.setString(5, imagePath);
            stmt.setString(6, specialDiscounts);
		 stmt.setString(7,ManufacturerName);
		 stmt.setString(8,Rebates);
            return stmt.executeUpdate() > 0; // Returns true if the insert was successful
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

public boolean addProductReport(String productName,String price,String DiscountSale,int quantity,String Rebates){
	String query = "INSERT INTO ProductReport (productname, productprice, productsale, availableproductcount,productrebate) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, productName);
            stmt.setDouble(2, Double.parseDouble(price));
		  if(DiscountSale!=null && !DiscountSale.trim().isEmpty()){
            stmt.setDouble(3, Double.parseDouble(DiscountSale));
		 }
		 else {
            stmt.setNull(3, java.sql.Types.DOUBLE);
        }
            stmt.setInt(4, quantity);
		if(Rebates != null && !Rebates.trim().isEmpty()){
		 stmt.setDouble(5, Double.parseDouble(Rebates));
		}
		else {
            stmt.setNull(5, java.sql.Types.DOUBLE);
        }
	     return stmt.executeUpdate() > 0; // Returns true if the insert was successful
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;

}


public static List<Map<String, Object>> getAllProducts() {
    List<Map<String, Object>> products = new ArrayList<>();
    String query = "SELECT p.ProductID, p.ProductName, p.ManufacturerName, c.CategoryName, p.Description, p.Price, p.ImagePath,p.Rebates, p.Discounts " +"FROM Products p " +"JOIN ProductCategory c ON p.CategoryID = c.CategoryID";
    try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
         
        ResultSet resultSet = preparedStatement.executeQuery();
        
        while (resultSet.next()) {
            Map<String, Object> product = new HashMap<>();
            product.put("productID", resultSet.getInt("ProductID"));
            product.put("productName", resultSet.getString("ProductName"));
		 product.put("ManufacturerName", resultSet.getString("ManufacturerName"));
            product.put("categoryName", resultSet.getString("CategoryName"));
            product.put("description", resultSet.getString("Description"));
            product.put("price", resultSet.getString("Price"));
            product.put("imagePath", resultSet.getString("ImagePath"));
            product.put("discounts", resultSet.getString("Discounts"));
		 product.put("Rebates", resultSet.getString("Rebates"));
            products.add(product);
        }
        
        resultSet.close();
    } catch (SQLException e) {
        e.printStackTrace();
    }
    
    return products;
}


public static List<Map<String, Object>> getProductsByCategory(String categoryName) {
    List<Map<String, Object>> products = new ArrayList<>();
    String query = "SELECT p.ProductID, p.ProductName, c.CategoryName, p.Description, p.Price, p.ImagePath,p.Rebates, p.Discounts " +
                   "FROM Products p " +
                   "JOIN ProductCategory c ON p.CategoryID = c.CategoryID " +
                   "WHERE c.CategoryName = ?";  // Filter by category name

    try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
         
        preparedStatement.setString(1, categoryName); // Set category name parameter
        ResultSet resultSet = preparedStatement.executeQuery();
        
        while (resultSet.next()) {
            Map<String, Object> product = new HashMap<>();
            product.put("productID", resultSet.getInt("ProductID"));
            product.put("productName", resultSet.getString("ProductName"));
            product.put("categoryName", resultSet.getString("CategoryName"));
            product.put("description", resultSet.getString("Description"));
            product.put("price", resultSet.getString("Price"));
            product.put("imagePath", resultSet.getString("ImagePath"));
            product.put("discounts", resultSet.getString("Discounts"));
		 product.put("Rebates", resultSet.getString("Rebates"));
            products.add(product);
        }
        
        resultSet.close();
    } catch (SQLException e) {
        e.printStackTrace();
    }
    
    return products;
}

public static boolean deleteProductAccessory(int productId) {
    String query = "DELETE FROM Accessories WHERE ProductID = ?";
    
    try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
         
        preparedStatement.setInt(1, productId);
        int rowsAffected = preparedStatement.executeUpdate();
        
        return rowsAffected > 0; // return true if the product was deleted successfully
    } catch (SQLException e) {
        e.printStackTrace();
    }
    
    return false; // product deletion failed
}




public static boolean deleteProductByName(String productName) {
    String query = "DELETE FROM Products WHERE ProductName = ?";
    
    try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
         
        preparedStatement.setString(1, productName);
        int rowsAffected = preparedStatement.executeUpdate();
        
        return rowsAffected > 0; // return true if the product was deleted successfully
    } catch (SQLException e) {
        e.printStackTrace();
    }
    
    return false; // product deletion failed
}

public boolean updateProduct(int productID, String productName,String ManufacturerName, String description,String imagePath, double price, String specialDiscounts, String Rebates) {
        String query = "UPDATE Products SET ProductName = ?, Description = ?,ImagePath=?, Price = ?, Discounts = ?, ManufacturerName = ?, Rebates = ? WHERE ProductID = ?";
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, productName);
            preparedStatement.setString(2, description);
		 preparedStatement.setString(3, imagePath);
            preparedStatement.setDouble(4, price);
            preparedStatement.setString(5, specialDiscounts);
		 preparedStatement.setString(6, ManufacturerName);
		 preparedStatement.setString(7, Rebates);
            preparedStatement.setInt(8, productID);

            int rowsAffected = preparedStatement.executeUpdate();
            return rowsAffected > 0; // Returns true if the product was updated successfully
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // Returns false if an error occurred
        }
    }

public boolean updateProductReport(String productName,double price, String specialDiscounts, String Rebates) {
        String query = "UPDATE productreport SET productprice = ?, productsale = ?, productrebate = ? WHERE productname = ?";
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setDouble(1, price);
		 if(specialDiscounts!=null && !specialDiscounts.trim().isEmpty()){
            preparedStatement.setDouble(2, Double.parseDouble(specialDiscounts));
		 }
		 else {
            preparedStatement.setNull(2, java.sql.Types.DOUBLE);
        }
		 if(Rebates!=null && !Rebates.trim().isEmpty()){
            preparedStatement.setDouble(3, Double.parseDouble(Rebates));
		 }
		 else {
            preparedStatement.setNull(3, java.sql.Types.DOUBLE);
        }
		 preparedStatement.setString(4, productName);

            int rowsAffected = preparedStatement.executeUpdate();
            return rowsAffected > 0; // Returns true if the product was updated successfully
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // Returns false if an error occurred
        }
    }


public static boolean addProductToCart(String orderId, int userId, String name, int productId, String productName, int categoryId, String categoryName, String price, String imagePath, String discounts, String description,String orderstatus,String Rebates) {
    String query = "INSERT INTO OrderCart (OrderID, user_id, name, ProductID, ProductName, CategoryID, CategoryName, Price, ImagePath, Discounts, Description, Order_status,Rebates) "
                 + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";

    try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
        preparedStatement.setString(1, orderId);
        preparedStatement.setInt(2, userId);
        preparedStatement.setString(3, name);
        preparedStatement.setInt(4, productId);
        preparedStatement.setString(5, productName);
        preparedStatement.setInt(6, categoryId);
        preparedStatement.setString(7, categoryName);
        preparedStatement.setString(8, price);
        preparedStatement.setString(9, imagePath);
	   if (discounts.isEmpty()) {
            preparedStatement.setNull(10, java.sql.Types.VARCHAR);
        } else {
            preparedStatement.setString(10, discounts);
        }
        preparedStatement.setString(11, description);
	   preparedStatement.setString(12, orderstatus);
	   preparedStatement.setString(13, Rebates);

        int result = preparedStatement.executeUpdate();
        return result > 0; // Return true if the insert was successful

    } catch (SQLException e) {
        e.printStackTrace();
        return false; // Return false if there was an error
    }
}


public static boolean addProductAccessoryToCart(String orderId, int userId, String name, int productId, int categoryId, String categoryName, String price, String imagePath,int accessoryid, String accessoryname ,String orderstatus) {
    String query = "INSERT INTO OrderCart (OrderID, user_id, name, ProductID, CategoryID, CategoryName, Price, ImagePath, accessory_id, accessory_name , Order_status) "
                 + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
        preparedStatement.setString(1, orderId);
        preparedStatement.setInt(2, userId);
        preparedStatement.setString(3, name);
        preparedStatement.setInt(4, productId);
        preparedStatement.setInt(5, categoryId);
        preparedStatement.setString(6, categoryName);
        preparedStatement.setString(7, price);
        preparedStatement.setString(8, imagePath);
	   preparedStatement.setInt(9, accessoryid);
	   preparedStatement.setString(10, accessoryname);
	   preparedStatement.setString(11, orderstatus);


        int result = preparedStatement.executeUpdate();
        return result > 0; // Return true if the insert was successful

    } catch (SQLException e) {
        e.printStackTrace();
        return false; // Return false if there was an error
    }
}


public static ResultSet getOrderCartByUsername(String username) throws SQLException {
        Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
        String query = "SELECT * FROM OrderCart WHERE name = ? AND Order_status=?";
        PreparedStatement pstmt = conn.prepareStatement(query);
        pstmt.setString(1, username);
        pstmt.setString(2, "In-Cart");
        return pstmt.executeQuery();
    }


public boolean deleteProductFromCart(String username, String productName) {
        String sql = "DELETE FROM OrderCart WHERE name = ? AND ProductName = ? AND Order_status = ?";

        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
             
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, productName);
		 preparedStatement.setString(3, "In-Cart");
            int rowsAffected = preparedStatement.executeUpdate();
		System.out.println("Rows affected:"+rowsAffected);
            return rowsAffected > 0; // Return true if a product was deleted

        } catch (SQLException e) {
            e.printStackTrace();
            return false; // Return false on error
        }
    }

public boolean deleteProductAccessoryFromCart(String username, String accessoryname) {
        String sql = "DELETE FROM OrderCart WHERE name = ? AND accessory_name = ? AND Order_status = ?";

        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
             
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, accessoryname);
		 preparedStatement.setString(3, "In-Cart");
            int rowsAffected = preparedStatement.executeUpdate();
		System.out.println("Rows affected:"+rowsAffected);
            return rowsAffected > 0; // Return true if a product was deleted

        } catch (SQLException e) {
            e.printStackTrace();
            return false; // Return false on error
        }
    }


public boolean cartExists(String username) {
        String sql = "SELECT COUNT(*) FROM OrderCart WHERE name = ?";
        
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
             
            preparedStatement.setString(1, username);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt(1) > 0; // Return true if cart exists
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false; // Return false if there was an error
    }

public String getOrderID(String customerName, String orderStatus) {
        String orderID = "-1"; 
String sql = "SELECT orderID FROM OrderCart WHERE name = ? AND Order_status = ?";
        
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            // Set the parameters for the query
            stmt.setString(1, customerName);
            stmt.setString(2, orderStatus);
            
            // Execute the query
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    // Retrieve the orderID if a record is found
                    orderID = rs.getString("orderID");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return orderID; // Return the orderID (or -1 if not found)
    }


public void insertOrder(int user_id, String customerName, String customerAddress, String creditCardNumber,String purchaseDate, String shipDate, String deliveryMethod,String HomeShippingcost, int storeId,String storeaddress, String confirmationNumber, String orderStatus, String orderId, Double total_sales) {
        String sql = "INSERT INTO OrderCheckout (user_id, Customer_name, Customer_address, Creditcard_number,purchaseDate, shipDate, DeliveryMethod,Homeshippingcost, Store_id,Store_address,Confirmation_number, Order_status, OrderID, total_sales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
             preparedStatement.setInt(1, user_id);
            preparedStatement.setString(2, customerName);
            preparedStatement.setString(3, customerAddress);
            preparedStatement.setString(4, creditCardNumber);
            preparedStatement.setString(5, purchaseDate);
            preparedStatement.setString(6, shipDate);
            preparedStatement.setString(7, deliveryMethod);
		 preparedStatement.setString(8, HomeShippingcost);
            preparedStatement.setInt(9, storeId);
            preparedStatement.setString(10, storeaddress);
            preparedStatement.setString(11, confirmationNumber);
            preparedStatement.setString(12, orderStatus);
            preparedStatement.setString(13, orderId);
		 preparedStatement.setDouble(14, total_sales);
            
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

public void ordercartstatus(String orderid,String orderstatus){
 String sql = "UPDATE ordercart SET Order_status = ? WHERE OrderID = ?";
	try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, orderstatus);
            preparedStatement.setString(2, orderid);
            
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }

}

public void ordercheckoutstatus(String orderid,String orderstatus){
 String sql = "UPDATE OrderCheckout SET Order_status = ? WHERE OrderID = ?";
	try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, orderstatus);
            preparedStatement.setString(2, orderid);
            
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }

}



public List<List<String>> getOrderCheckoutListByUser(int userid) {
        List<List<String>> orderList = new ArrayList<>();
        String query = "SELECT purchaseDate, shipDate, DeliveryMethod, Store_id, Store_address, Order_status, OrderID, Confirmation_number FROM OrderCheckout WHERE user_id = ?";

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setInt(1, userid);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                List<String> orderDetails = new ArrayList<>();
                orderDetails.add(rs.getString("purchaseDate"));
                orderDetails.add(rs.getString("shipDate"));
               orderDetails.add(rs.getString("DeliveryMethod"));
           orderDetails.add(String.valueOf(rs.getInt("Store_id")));
                orderDetails.add(rs.getString("Store_address"));
                orderDetails.add(rs.getString("Order_status"));
                orderDetails.add(rs.getString("OrderID"));
			orderDetails.add(rs.getString("Confirmation_number"));
                orderList.add(orderDetails);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return orderList;
    }

public boolean deleteOrder(String orderID, int userId) {
        Connection connection = null;
        PreparedStatement preparedStatementCheckout = null;
        PreparedStatement preparedStatementCart = null;
        boolean isDeleted = false;

        try {
            connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
            connection.setAutoCommit(false); 
            // Delete from ordercheckout
            String deleteCheckoutQuery = "DELETE FROM ordercheckout WHERE OrderID = ? AND user_id = ?";
            preparedStatementCheckout = connection.prepareStatement(deleteCheckoutQuery);
            preparedStatementCheckout.setString(1, orderID);
            preparedStatementCheckout.setInt(2, userId);
            int checkoutRowsAffected = preparedStatementCheckout.executeUpdate();

            // Delete from ordercart
            String deleteCartQuery = "DELETE FROM ordercart WHERE OrderID = ? AND user_id = ?";
            preparedStatementCart = connection.prepareStatement(deleteCartQuery);
            preparedStatementCart.setString(1, orderID);
            preparedStatementCart.setInt(2, userId);
            int cartRowsAffected = preparedStatementCart.executeUpdate();

            // Commit the transaction if both deletions are successful
            if (checkoutRowsAffected > 0 || cartRowsAffected > 0) {
                connection.commit();
                isDeleted = true; // Order deletion was successful
            } else {
                connection.rollback(); // Rollback if no rows were affected
            }
        } catch (SQLException e) {
            // Handle SQL exception
            System.err.println("Error deleting order: " + e.getMessage());
            if (connection != null) {
                try {
                    connection.rollback(); // Rollback in case of error
                } catch (SQLException rollbackEx) {
                    System.err.println("Error rolling back transaction: " + rollbackEx.getMessage());
                }
            }
        } finally {
            // Close resources
            try {
                if (preparedStatementCheckout != null) {
                    preparedStatementCheckout.close();
                }
                if (preparedStatementCart != null) {
                    preparedStatementCart.close();
                }
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException e) {
                System.err.println("Error closing resources: " + e.getMessage());
            }
        }

        return isDeleted;
    }


public static String getProductDetails(String productName) {
        String jsonResponse = "{\"error\": \"Product not found\"}";
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        try {
            // Establish the database connection
            connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);

            // SQL query to fetch price and discount based on product name
            String sql = "SELECT Price, Discounts,ManufacturerName FROM Products WHERE ProductName = ?";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, productName);

            // Execute the query
            resultSet = preparedStatement.executeQuery();

            // Check if the product exists
            if (resultSet.next()) {
                String price = resultSet.getString("Price");
                String discount = resultSet.getString("Discounts");
String manufacturerName=resultSet.getString("ManufacturerName");
jsonResponse = "{\"price\": " + price + ", \"discount\": " + discount + ", \"manufacturerName\": \"" + manufacturerName + "\"}";
                
            }
        } catch (SQLException e) {
            e.printStackTrace();
            jsonResponse = "{\"error\": \"Database error\"}";
        } finally {
            // Close resources to prevent memory leaks
            try {
                if (resultSet != null) resultSet.close();
                if (preparedStatement != null) preparedStatement.close();
                if (connection != null) connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return jsonResponse;
    }


public static List<Map<String, Object>> getTopSoldProducts() {
    List<Map<String, Object>> soldProducts = new ArrayList<>();
    String query = "SELECT ProductName,Description, ProductID, COUNT(*) AS productCount FROM ordercart WHERE Order_status = 'Order Placed' and ProductName!='null' GROUP BY ProductID, ProductName, Description ORDER BY productCount DESC;";
    
    try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         Statement stmt = conn.createStatement(); 
         ResultSet rs = stmt.executeQuery(query)) {
        
        while (rs.next()) {
            Map<String, Object> product = new HashMap<>();
            product.put("ProductName", rs.getString("ProductName"));
		product.put("Description", rs.getString("Description"));
            product.put("productCount", rs.getInt("productCount"));
            soldProducts.add(product);
        }
    } catch (SQLException e) {
        e.printStackTrace();
        // Handle exception
    }
    
    return soldProducts;
}

public static List<Map<String, Object>> getTopZipCodes() {
    List<Map<String, Object>> zipCodes = new ArrayList<>();
    String query = "SELECT oc.Store_address, COUNT(o.ProductID) AS productCount FROM smarthomes.ordercart o JOIN ordercheckout oc ON o.OrderID = oc.OrderID WHERE o.Order_status = 'Order Placed' and oc.DeliveryMethod='Store' GROUP BY oc.Store_address ORDER BY productCount DESC LIMIT 5;";

    try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         Statement stmt = conn.createStatement(); 
         ResultSet rs = stmt.executeQuery(query)) {
        
        while (rs.next()) {
            Map<String, Object> zipCode = new HashMap<>();
            zipCode.put("zipcode", rs.getString("Store_address"));
            zipCode.put("productCount", rs.getInt("productCount"));
            zipCodes.add(zipCode);
        }
    } catch (SQLException e) {
        e.printStackTrace();
        // Handle exception
    }
    
    return zipCodes;
}

public static List<Map<String, Object>> getAccessoriesByProductID(int productID) throws Exception {
        List<Map<String, Object>> accessories = new ArrayList<>();
        String query = "SELECT * FROM accessories WHERE ProductID = ?";
        
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD); 
             PreparedStatement stmt = conn.prepareStatement(query)) {
            
            stmt.setInt(1, productID);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Map<String, Object> accessory = new HashMap<>();
                accessory.put("accessory_id", rs.getInt("accessory_id"));
                accessory.put("accessory_name", rs.getString("accessory_name"));
                accessory.put("accessory_price", rs.getDouble("accessory_price"));
                accessory.put("accessoryPath", rs.getString("accessoryPath"));
                
                accessories.add(accessory);
            }
        } 
        return accessories;
    }

public List<Product> getAllProductsReport() {
        return getProducts("SELECT productname, productprice, availableproductcount, productsale, productrebate FROM ProductReport");
    }

    // Method to get products on sale
    public List<Product> getProductsOnSale() {
        return getProducts("SELECT productname, productprice, availableproductcount, productsale, productrebate FROM ProductReport WHERE productsale IS NOT NULL");
    }

    // Method to get products with manufacturer rebates
    public List<Product> getProductsWithRebates() {
        return getProducts("SELECT productname, productprice, availableproductcount, productsale, productrebate FROM ProductReport WHERE productrebate IS NOT NULL");
    }

    // General method to get products based on a query
    private List<Product> getProducts(String query) {
        List<Product> productList = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query);
             ResultSet resultSet = preparedStatement.executeQuery()) {

            while (resultSet.next()) {
                String productName = resultSet.getString("productname");
                double productPrice = resultSet.getDouble("productprice");
                int availableCount = resultSet.getInt("availableproductcount");
                Double productSale = resultSet.getDouble("productsale"); // Can be null
                Double productRebate = resultSet.getDouble("productrebate"); // Can be null

                Product product = new Product(productName, productPrice, availableCount, productSale, productRebate);
                productList.add(product);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return productList;
    }

    // Inner Product class
    public static class Product {
        private String productName;
        private double productPrice;
        private int availableCount;
        private Double productSale; // Sale can be null
        private Double productRebate; // Rebate can be null

        public Product(String productName, double productPrice, int availableCount, Double productSale, Double productRebate) {
            this.productName = productName;
            this.productPrice = productPrice;
            this.availableCount = availableCount;
            this.productSale = productSale;
            this.productRebate = productRebate;
        }

        public String getProductName() {
            return productName;
        }

        public double getProductPrice() {
            return productPrice;
        }

        public int getAvailableCount() {
            return availableCount;
        }

        public Double getProductSale() {
            return productSale;
        }

        public Double getProductRebate() {
            return productRebate;
        }
    }


public static List<String> getSalesReport() {
        List<String> salesReport = new ArrayList<>();
        try {
            Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
            Statement stmt = conn.createStatement();
            String query = "SELECT productname, productprice, productssold, totalsales FROM ProductReport WHERE productssold > 0";
            ResultSet rs = stmt.executeQuery(query);

            while (rs.next()) {
                String productName = rs.getString("productname");
                double productPrice = rs.getDouble("productprice");
                int productsSold = rs.getInt("productssold");
                double totalSales = rs.getDouble("totalsales");

                String row = String.format("{\"productname\":\"%s\", \"productprice\":%f, \"productssold\":%d, \"totalsales\":%f}",
                        productName, productPrice, productsSold, totalSales);
                salesReport.add(row);
            }
            rs.close();
            stmt.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return salesReport;
    }

public int getreportproductcount(String productName) {
        String query = "SELECT availableproductcount FROM productreport WHERE productname = ?";
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, productName);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt("availableproductcount");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

public int getreportproductssold(String productName) {
        String query = "SELECT productssold FROM productreport WHERE productname = ?";
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, productName);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt("productssold");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

public double getreporttotalsale(String productName) {
        String query = "SELECT totalsales FROM productreport WHERE productname = ?";
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, productName);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getDouble("totalsales");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }


public boolean productreportupdate(String productName,int productcount,int productsold,double totalsale) {
        String query = "UPDATE productreport SET availableproductcount = ?, productssold = ?, totalsales = ? WHERE productname = ?";
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setInt(1, productcount);
            preparedStatement.setInt(2, productsold);
            preparedStatement.setDouble(3, totalsale);
            preparedStatement.setString(4, productName);
            int rowsAffected = preparedStatement.executeUpdate();
            return rowsAffected > 0; // Returns true if the product was updated successfully
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // Returns false if an error occurred
        }
    }

public static List<Map<String, Object>> getDailySalesReport() {
        List<Map<String, Object>> salesReports = new ArrayList<>();
        String query = """
            SELECT 
    o.purchaseDate AS Date,
    SUM(distinct o.total_sales) AS TotalSales,
    COUNT(oc.productName) AS TotalProductCount,
    GROUP_CONCAT(Distinct CONCAT(oc.productName) ORDER BY oc.productName SEPARATOR ', ') AS ProductNames
FROM 
    ordercheckout o
JOIN 
    OrderCart oc ON o.OrderID = oc.OrderID
WHERE 
    oc.Order_status != 'In-Cart' 
    AND oc.productName != ""
GROUP BY 
    o.purchaseDate
ORDER BY 
    STR_TO_DATE(o.purchaseDate, '%a %b %d %Y'); 
        """;

        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement preparedStatement = connection.prepareStatement(query);
             ResultSet resultSet = preparedStatement.executeQuery()) {

            while (resultSet.next()) {
                Map<String, Object> report = new HashMap<>();
                report.put("date", resultSet.getString("Date"));
                report.put("totalSales", resultSet.getDouble("TotalSales"));
                report.put("totalProductCount", resultSet.getInt("TotalProductCount"));
                report.put("productNames", resultSet.getString("ProductNames"));
                salesReports.add(report);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return salesReports;
    }

public static ArrayList<String> getOrderIdsByUserName(String userName) {
	   String status="In-Cart";
        ArrayList<String> orderIds = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(
                "SELECT DISTINCT OrderID FROM ordercart WHERE name = ? and Order_Status != ?")) {
             
            stmt.setString(1, userName);
		 stmt.setString(2, status);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                orderIds.add(rs.getString("OrderID"));
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orderIds;
    }

public boolean addTicket(String ticketstatus,String OrderId,String ticketdescription,String ticketNumber,String imgpath,String AIstatus) {
        String query = "INSERT INTO tickets(ticketNumber, ticketStatus, imagePath, ticketDescription,orderId,AIstatus) VALUES (?, ?, ?, ?, ?,?)";
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, ticketNumber);
            stmt.setString(2, ticketstatus);
            stmt.setString(3, imgpath);
            stmt.setString(4, ticketdescription);
            stmt.setString(5, OrderId);
		 stmt.setString(6,AIstatus);
            return stmt.executeUpdate() > 0; // Returns true if the insert was successful
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

public String getTicket(String ticketNumber) {
                String query = "SELECT imagePath FROM tickets WHERE ticketNumber = ?";

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement pst = conn.prepareStatement(query)) {

            pst.setString(1, ticketNumber);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                        return rs.getString("imagePath");
                    
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return "";
    }

public String getticketAIstatus(String ticketNumber) {
                String query = "SELECT AIstatus FROM tickets WHERE ticketNumber = ?";

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
             PreparedStatement pst = conn.prepareStatement(query)) {

            pst.setString(1, ticketNumber);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                        return rs.getString("AIstatus");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return "";
    }


}