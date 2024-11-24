<h1 strong>SMART HOMES</h1>

1) Firstly install the Apache Tomcat "apache-tomcat-9.0.93" version --> https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.93/bin/

2) Once installed unzip the folder in the "C" drive of your computer

3) Once unzipped, in the "Apache Tomcat" folder go to "webapps" folder and place the folder from my "backend" folder containing "SmartHomes" folder inside the "webapps" folder

4) Add "json-20210307.jar; mysql-connector-java.jar; mongodb-driver-3.12.10.jar; mongodb-driver-core-3.12.10.jar; bson-3.12.10.jar; okio-2.10.0.jar; okhttp-4.9.3.jar" file inside the "Apache Tomcat" folder containing "lib" folder

5) Install jdk-17 version if not installed and save it in "C:\Program Files\Java\" folder

6) Performing below java commands in the terminal :
	a) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar -d . LoginServlet.java MySQLDataStoreUtilities.java Store.java
	b) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar -d . StoreServlet.java MySQLDataStoreUtilities.java Store.java
	c) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar -d . CategoryServlet.java MySQLDataStoreUtilities.java Store.java
	d) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . ProductServlet.java MySQLDataStoreUtilities.java Store.java
	e) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . BuyProductServlet.java MySQLDataStoreUtilities.java Store.java
	f) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . CheckoutServlet.java MySQLDataStoreUtilities.java Store.java
	g) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . OrderServlet.java MySQLDataStoreUtilities.java Store.java
	h) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . CancelOrderServlet.java MySQLDataStoreUtilities.java Store.java
	i) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mongodb-driver-3.12.10.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar;C:\apache-tomcat-9.0.93\lib\mongodb-driver-core-3.12.10.jar;C:\apache-tomcat-9.0.93\lib\bson-3.12.10.jar -d . ProductReviewServlet.java MongoDBDataStoreUtilities.java MySQLDataStoreUtilities.java Store.java
	j) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . CustomerServlet.java MySQLDataStoreUtilities.java Store.java
	k) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mongodb-driver-3.12.10.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar;C:\apache-tomcat-9.0.93\lib\mongodb-driver-core-3.12.10.jar;C:\apache-tomcat-9.0.93\lib\bson-3.12.10.jar -d . TrendingServle
t.java MongoDBDataStoreUtilities.java MySQLDataStoreUtilities.java Store.java
	l) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . ProductAccessoryServlet.java MySQLDataStoreUtilities.java Store.java
	m)  javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . BuyProductAccessoryServlet.java MySQLDataStoreUtilities.java Store.java
	n) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . InventoryReportServlet.java MySQLDataStoreUtilities.java Store.java
	o) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . SalesReportServlet.java MySQLDataStoreUtilities.java Store.java
	p) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . DailySalesReportServlet.java MySQLDataStoreUtilities.java Store.java
	q) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar -d . AjaxUtility.java
	r) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\mysql-connector-java.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar;C:\apache-tomcat-9.0.93\lib\okhttp-4.9.3.jar;C:\apache-tomcat-9.0.93\lib\okio-2.10.0.jar -d . OpenTicketOrderServlet.java MySQLDataStoreUtilities.java Store.java
	s) javac -source 17 -target 17 -cp C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\json-20210307.jar -d . SuggestionsServlet.java

7) Start backend server using following commands in terminal:
   a) set JAVA_HOME=C:\Program Files\Java\jdk-17
   b) set PATH="C:\Program Files\Java\jdk-17\bin";%PATH%
   c) set CLASSPATH=.;C:\apache-tomcat-9.0.93\lib\servlet-api.jar;C:\apache-tomcat-9.0.93\lib\jsp-api.jar;C:\apache-tomcat-9.0.93\lib\el-api.jar;C:\apache-tomcat-9.0.93\lib\commons-beanutils-1.8.3.jar;C:\apache-tomcat-9.0.93\mongo-java-driver-3.1.0.jar;C:\apache-tomcat-9.0.93\lib\gson-2.3.1.jar
   d) set ANT_HOME=C:\apache-tomcat-9.0.93
   e) set TOMCAT_HOME=C:\apache-tomcat-9.0.93
   f) set CATALINA_HOME=C:\apache-tomcat-9.0.93
   h) cd "C:\apache-tomcat-9.0.93\bin"
   i) startup.bat

8) Once backend server starts running perfectly try testing the url of it. Default would be "http://localhost:8080/". If it works we move further

9) We need to have our Docker image running before we start our frontend. It would run on "http://localhost:9200/" as default. If it works we move further. Steps for generating docker image can be found in Elastic Search Vector Embedding folder.

9) In frontend folder we have config.js file -- Set baseURL if it is not using default url.

10) Once everthing is saved in frontend, Perform following command:
	npm start
