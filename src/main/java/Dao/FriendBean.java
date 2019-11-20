package Dao;

import java.util.ArrayList;

public class FriendBean {
   private ArrayList<singleFriend> singleFriend;
   private ArrayList<groupFriend> groupFriend;

   public ArrayList<Dao.singleFriend> getSingleFriend () {
      return singleFriend;
   }

   public void setSingleFriend (ArrayList<Dao.singleFriend> singleFriend) {
      this.singleFriend = singleFriend;
   }

   public ArrayList<Dao.groupFriend> getGroupFriend () {
      return groupFriend;
   }

   public void setGroupFriend (ArrayList<Dao.groupFriend> groupFriend) {
      this.groupFriend = groupFriend;
   }
}