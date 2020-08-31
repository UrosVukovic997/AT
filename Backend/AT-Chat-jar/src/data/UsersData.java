package data;

import java.util.ArrayList;

import javax.ejb.Singleton;

import model.User;

@Singleton
public class UsersData {
	
    private ArrayList<User> allUsers;
    private ArrayList<User> onlineUsers;
    private static UsersData instance = null;
	
    public UsersData() {
        this.allUsers = new ArrayList<>();
        this.onlineUsers = new ArrayList<>();
	}
    
    public static UsersData getInstance( ) {
    	if(UsersData.instance == null)
    		UsersData.instance = new UsersData();
   		return UsersData.instance;
 		
    }

	public ArrayList<User> getAllUsers() {
		return allUsers;
	}

	public void setAllUsers(ArrayList<User> allUsers) {
		this.allUsers = allUsers;
	}

	public ArrayList<User> getOnlineUsers() {
		return onlineUsers;
	}

	public void setOnlineUsers(ArrayList<User> onlineUsers) {
		this.onlineUsers = onlineUsers;
	}
	
	public void logout(User user) {
		this.onlineUsers.remove(user);
	}
      

}
