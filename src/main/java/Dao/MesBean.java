package Dao;

public class MesBean {
   private Integer id;
   private Integer chat;
   private String user;
   private String time;
   private String message;
   private Integer identity;
   private String[] members;
   private String groupName;

   public String getGroupName () {
      return groupName;
   }

   public void setGroupName (String groupName) {
      this.groupName = groupName;
   }

   public Integer getIdentity () {
      return identity;
   }

   public void setIdentity (Integer identity) {
      this.identity = identity;
   }

   public String[] getMembers () {
      return members;
   }

   public void setMembers (String[] members) {
      this.members = members;
   }

   public MesBean () {
   }

   public Integer getChat () {
      return chat;
   }

   public Integer getId () {
      return id;
   }

   public void setId (Integer id) {
      this.id = id;
   }

   public void setChat (Integer chat) {
      this.chat = chat;
   }

   public String getUser () {
      return user;
   }

   public void setUser (String user) {
      this.user = user;
   }

   public String getTime () {
      return time;
   }

   public void setTime (String time) {
      this.time = time;
   }

   public String getMessage () {
      return message;
   }

   public void setMessage (String message) {
      this.message = message;
   }
}
