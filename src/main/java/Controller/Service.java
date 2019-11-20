package Controller;

import Service.ProjectService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/Service")
public class Service extends HttpServlet {
   protected void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      response.setHeader("Content-type", "text/html;charset=UTF-8");
      String type = request.getParameter("type");
      switch (type) {
         case "load":
            try {
               String username = request.getParameter("username");
               response.getWriter().print(ProjectService.checkByUsername(username));
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "SolveMessage":
            try {
               Integer chat = Integer.parseInt(request.getParameter("chat"));
               response.getWriter().print(ProjectService.getInfomation(chat));
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "getGroupMember":
            try {
               Integer chat = Integer.parseInt(request.getParameter("chat"));
               response.getWriter().print(ProjectService.getGroupMember(chat));
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "getAllUser":
            try {
               System.out.println(ProjectService.getAllUser());
               response.getWriter().print(ProjectService.getAllUser());
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "addFriend":
            try {
               String user1 = request.getParameter("user1");
               String user2 = request.getParameter("user2");
               ProjectService.addFriend(user1, user2);
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "addGroup":
            try {
               String user = request.getParameter("user");
               String name = request.getParameter("name");
               Integer chat = Integer.parseInt(request.getParameter("parent"));
               System.out.println(name);
               ProjectService.addGroup(user, name, chat);
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "getBOMDataByChat":
            try {
               Integer chat = Integer.parseInt(request.getParameter("chat"));
               System.out.println(ProjectService.getBOMDataByChat(chat));
               response.getWriter().print(ProjectService.getBOMDataByChat(chat));
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "addBomdataByChat":
            try {
               Integer chat = Integer.parseInt(request.getParameter("chat"));
               String databom = request.getParameter("databom");
               ProjectService.addBomdataByChat(chat, databom);
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
         case "deleteRelation":
            try {
               Integer chat = Integer.parseInt(request.getParameter("chat"));
               ProjectService.deleteRelation(chat);
            } catch (SQLException | ClassNotFoundException e) {
               e.printStackTrace();
            }
            break;
      }
   }

   protected void doGet (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      this.doPost(request, response);
   }
}
