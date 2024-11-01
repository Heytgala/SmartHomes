import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import com.mongodb.client.MongoCursor;



public class MongoDBDataStoreUtilities {
    private static MongoClient mongoClient;
    private static MongoDatabase database;
    private static MongoCollection<Document> reviewsCollection;

    static {
        mongoClient = new MongoClient("localhost", 27017); 
        database = mongoClient.getDatabase("SmartHomes"); 
        reviewsCollection = database.getCollection("reviews"); 
    }

    public static void insertReview(String categoryName, String productName, String price,int storeid, String Street,String City, String State, String Zipcode,String manufacturerName, String age, String gender, String occupation,String reviewRating, String reviewComments, int userid, String productonsale, String manufacturerRebate) {
        
        Document review = new Document("Product Category Name", categoryName)
                .append("Product Name", productName)
                .append("Product Price", price)
                .append("Store ID", storeid)
			.append("Street", Street)
			.append("City", City)
			.append("State", State)
			.append("Zip Code", Zipcode)
			.append("Product On Sale",productonsale)
                .append("manufacturer Name", manufacturerName)
			.append("Manufacturer Rebate", manufacturerRebate)
			.append("User ID", userid)
                .append("age", age)
                .append("gender", gender)
                .append("occupation", occupation)
                .append("reviewRating", reviewRating)
                .append("reviewComments", reviewComments);
                

        reviewsCollection.insertOne(review);
    }

    public static void closeConnection() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }


public static List<Map<String, Object>> getLikedProducts() {
    MongoClient mongoClient = new MongoClient("localhost", 27017); 
    MongoDatabase database = mongoClient.getDatabase("SmartHomes"); 
    MongoCollection<Document> collection = database.getCollection("reviews"); 

    List<Map<String, Object>> topLikedProducts = new ArrayList<>();

    try {
        MongoCursor<Document> cursor = collection.find()
            .sort(new Document("reviewRating", -1))
            .limit(5) 
            .iterator();

        while (cursor.hasNext()) {
            Document doc = cursor.next();
            topLikedProducts.add(doc);
        }
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        mongoClient.close();
    }

    return topLikedProducts; 
}


}
