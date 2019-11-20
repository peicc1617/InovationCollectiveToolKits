package Dao;

import java.util.ArrayList;
import java.util.HashMap;

public class groupFriend {
   private Integer id;
   private String name;
   private ArrayList<singleFriend> subGroup = new ArrayList<>();

   public groupFriend (Integer id, String name) {
      this.id = id;
      this.name = name;
   }

   public Integer getId () {
      return id;
   }

   public void setId (Integer id) {
      this.id = id;
   }

   public String getName () {
      return name;
   }

   public void setName (String name) {
      this.name = name;
   }

   public ArrayList<singleFriend> getSubGroup () {
      return subGroup;
   }

   public void setSubGroup (ArrayList<singleFriend> subGroup) {
      this.subGroup = subGroup;
   }
}


