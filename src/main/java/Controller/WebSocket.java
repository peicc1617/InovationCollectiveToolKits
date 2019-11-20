package Controller;

import Dao.MesBean;
import Service.ProjectService;
import com.google.gson.Gson;
import net.sf.json.JSONObject;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/Controller/webSocket/{username}")
public class WebSocket {
   private static int onlineCount = 0;
   private static Map<String, WebSocket> clients = new ConcurrentHashMap<>();
   private Session session;
   private String username;

   @OnOpen
   public void onOpen (@PathParam("username") String username, Session session) throws IOException {
      this.username = username;
      this.session = session;
      addOnlineCount();
      clients.put(username, this);
      System.out.println(this.username + "已上线");
   }


   @OnMessage
   public void onMessage (String message) throws IOException {
      JSONObject jsonTo = JSONObject.fromObject(message);
      MesBean mesBean = new MesBean();
      mesBean.setMessage((String) jsonTo.get("message"));
      mesBean.setMembers(((String) jsonTo.get("To")).split("-"));
      mesBean.setIdentity(Integer.valueOf((String) jsonTo.get("identity")));
      mesBean.setUser(this.username);
      mesBean.setGroupName((String) jsonTo.get("groupName"));
      mesBean.setChat(Integer.valueOf((String) jsonTo.get("chat")));
      try {
         ProjectService.saveInformation(mesBean);
      } catch (SQLException | ClassNotFoundException e) {
         e.printStackTrace();
      }
      sendMessageTo(mesBean);
   }

   @OnClose
   public void onClose () throws IOException {
      clients.remove(username);
      subOnlineCount();
   }

   @OnError
   public void onError (Session session, Throwable error) {
      error.printStackTrace();
   }

   private void sendMessageTo (MesBean mesBean) throws IOException {
      Gson gson = new Gson();
      for (int i = 0; i < mesBean.getMembers().length; i++) {
         for (WebSocket item : clients.values()) {
            if (item.username.equals(mesBean.getMembers()[i])) {
               item.session.getAsyncRemote().sendText(gson.toJson(mesBean));
            }
         }
      }
   }

   private void sendMessageAll (String message) throws IOException {
      for (WebSocket item : clients.values()) {
         item.session.getAsyncRemote().sendText(message);
      }
   }

   public static synchronized int getOnlineCount () {
      return onlineCount;
   }

   private static synchronized void addOnlineCount () {
      WebSocket.onlineCount++;
   }

   private static synchronized void subOnlineCount () {
      WebSocket.onlineCount--;
   }

   public static synchronized Map<String, WebSocket> getClients () {
      return clients;
   }
}