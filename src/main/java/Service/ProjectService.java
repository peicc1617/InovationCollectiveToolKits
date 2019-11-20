package Service;

import Dao.FriendBean;
import Dao.MesBean;
import Dao.groupFriend;
import Dao.singleFriend;
import Utils.DButils;
import com.google.gson.Gson;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;


public class ProjectService {
   private static FriendBean friendBean = new FriendBean();

   /*
    * 通过用户名查询好友
    */
   private static void getFriendByUsername (String userName) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB(0);
      Statement stm = connection.createStatement();
      ArrayList<singleFriend> sFriends = new ArrayList<>();
      String sql = "select * from relationship where identity=0";
      ResultSet rs = stm.executeQuery(sql);
      while (rs.next()) {
         if (rs.getString("user1").equals(userName)) {
            sFriends.add(new singleFriend(rs.getInt("chat"), rs.getString("user2")));
         }
         if (rs.getString("user2").equals(userName)) {
            sFriends.add(new singleFriend(rs.getInt("chat"), rs.getString("user1")));
         }
      }
      friendBean.setSingleFriend(sFriends);
      rs.close();
      stm.close();
      connection.close();
   }

   /*
    * 通过用户名查询群聊
    */
   private static void getGroupByUsername (String userName) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB(0);
      Statement stm = connection.createStatement();
//      HashMap<Integer, HashMap<Integer, String>> friendInfo = new HashMap<>();
//      HashMap<Integer, String> hashMap = new HashMap<>();
      ArrayList<groupFriend> gFriends = new ArrayList<>();
      String sql = "select * from relationship where identity=1";
      ResultSet rs = stm.executeQuery(sql);
      while (rs.next()) {
         ArrayList<String> arrayList = new ArrayList<>();
         for (int i = 1; i < 6; i++) {
            arrayList.add(rs.getString("user" + i));
         }
         if (arrayList.contains(userName)) {
            if (rs.getInt("parent") == 0) {
               gFriends.add(new groupFriend(rs.getInt("chat"), rs.getString("name")));
            }
            for (groupFriend gFriend : gFriends) {
               if (gFriend.getId() == rs.getInt("parent")) {
                  gFriend.getSubGroup().add(new singleFriend(rs.getInt("chat"), rs.getString("name")));
               }
            }
         }
      }
      friendBean.setGroupFriend(gFriends);
      rs.close();
      stm.close();
      connection.close();
   }

   /*
    * 通过用户名查询群聊
    */
   public static String checkByUsername (String userName) throws SQLException, IOException, ClassNotFoundException {
      Gson gson = new Gson();
      getFriendByUsername(userName);
      getGroupByUsername(userName);
      return gson.toJson(friendBean);
   }

   /*
    *查询消息
    */
   public static String getInfomation (Integer chat) throws SQLException, IOException, ClassNotFoundException {
      Gson gson = new Gson();
      Connection connection = DButils.connectDB(0);
      Statement stm = connection.createStatement();
      ArrayList<MesBean> arrayList = new ArrayList<>();
      String sql = "select * from message where chat=" + chat;
      ResultSet rs = stm.executeQuery(sql);
      while (rs.next()) {
         MesBean mesBean = new MesBean();
         mesBean.setId(rs.getInt("id"));
         mesBean.setUser(rs.getString("user"));
         mesBean.setMessage(rs.getString("message"));
         mesBean.setTime(rs.getString("time"));
         arrayList.add(mesBean);
      }
      rs.close();
      stm.close();
      connection.close();
      return gson.toJson(arrayList);
   }

   /*
    *保存信息
    */
   public static void saveInformation (MesBean mesBean) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB(0);
      Statement stm = connection.createStatement();
      String sql = "insert into message (chat,user,message) values(" + mesBean.getChat() + ",'" + mesBean.getUser() + "','" + mesBean.getMessage() + "')";
      stm.executeUpdate(sql);
      stm.close();
      connection.close();
   }

   /*
    *查询消息
    */
   public static String getGroupMember (Integer chat) throws SQLException, IOException, ClassNotFoundException {
      Gson gson = new Gson();
      Connection connection = DButils.connectDB(0);
      Statement stm = connection.createStatement();
      ArrayList<String> arrayList = new ArrayList<>();
      String sql = "select * from relationship where chat=" + chat;
      ResultSet rs = stm.executeQuery(sql);
      while (rs.next()) {
         for (int i = 1; i < 6; i++) {
            if (rs.getString("user" + i) != null && rs.getString("user" + i).length() > 1) {
               arrayList.add(rs.getString("user" + i));
            }
         }
      }
      rs.close();
      stm.close();
      connection.close();
      return gson.toJson(arrayList);
   }

   /*
    * 查询所有用户
    * */
   public static String getAllUser () throws SQLException, IOException, ClassNotFoundException {
      Gson gson = new Gson();
      Connection connection = DButils.connectDB(1);
      Statement stm = connection.createStatement();
      ArrayList<String> arrayList = new ArrayList<>();
      String sql = "select * from user_info";
      ResultSet rs = stm.executeQuery(sql);
      while (rs.next()) {
         arrayList.add(rs.getString("nickName"));
      }
      rs.close();
      stm.close();
      connection.close();
      return gson.toJson(arrayList);
   }

   public static void addFriend (String user1, String user2) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB(0);
      Statement stm = connection.createStatement();
      String sql = "INSERT INTO relationship (user1,user2,identity) VALUES ('" + user1 + "','" + user2 + "',0);";
      stm.executeUpdate(sql);
      stm.close();
      connection.close();
   }

   public static void addGroup (String user, String name, Integer parent) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB(0);
      Statement stm = connection.createStatement();
      String[] friend = user.split("-");

      String temp2 = "";
      for (int i = 1; i < friend.length + 1; i++) {
         temp2 += "user" + i + ",";
      }
      String sql = "INSERT INTO relationship (" + temp2 + "name,identity,parent) VALUES (" +
              Arrays.stream(friend).map(f -> "'" + f + "'").collect(Collectors.joining(","))
              + ",'" + name + "',1,'" + parent + "');";
      System.out.println(sql);
      stm.executeUpdate(sql);
      stm.close();
      connection.close();
   }

   /*
    *通过群聊Id查询BOM数据
    */
   public static String getBOMDataByChat (Integer chat) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB(0);
      Statement stm = connection.createStatement();
      String result = "";
      String sql = "select * from databom where chat='" + chat + "'";
      ResultSet rs = stm.executeQuery(sql);
      while (rs.next()) {
         result = rs.getString("bomdata");
      }
      rs.close();
      stm.close();
      connection.close();
      return result;
   }

   /*
    *通过群聊Id添加数据
    */
   public static void addBomdataByChat (Integer chat, String databom) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB(0);
      Statement stm = connection.createStatement();
      String checkSql = "select * from databom where chat ='" + chat + "'";
      String updateSql = "UPDATE databom set bomdata='"+databom+"' where chat = '"+chat+"'";
      String insertSql = "INSERT INTO databom (chat,bomdata) VALUES ('" + chat + "','" + databom + "')";
      ResultSet rs = stm.executeQuery(checkSql);
      if(!rs.next()){
         stm.executeUpdate(insertSql);
      }else {
         stm.executeUpdate(updateSql);
      }
      stm.close();
      connection.close();
   }
   /*
    *通过群聊Id删除好友关系
    */
   public static void deleteRelation (Integer chat) throws SQLException, IOException, ClassNotFoundException {
      Connection connection = DButils.connectDB(0);
      Statement stm = connection.createStatement();
      String sql = "delete from relationship where chat ='" + chat + "'";
         stm.executeUpdate(sql);
      stm.close();
      connection.close();
   }

//   public static void main (String[] args) {
//      Gson gson = new Gson();
//      try {
//         deleteRelation(22);
////         System.out.println(getBOMDataByChat(1));
////         addBomdataByChat(5,"123456");
////         addFriend ("刘加军", "廖小强");
////         System.out.println( getAllUser());
////         System.out.println(checkByUsername("刘加军"));
////         getFriendByUsername("张斌斌");
////         getGroupByUsername("张斌斌");
////         System.out.println(gson.toJson(friendBean));
////         System.out.println(gson.toJson(getInfomation(1)));
////         saveInformation(1,"刘加军","9999-12-31-12-12","demo");
////         System.out.println(getGroupMember(6));
////         addGroup("liao-qiang-asdf","123456");
//      } catch (SQLException | IOException | ClassNotFoundException e) {
//         e.printStackTrace();
//      }
//   }
}