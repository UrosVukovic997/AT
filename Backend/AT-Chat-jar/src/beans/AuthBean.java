package beans;

import java.util.ArrayList;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import data.UsersData;
import exceptions.UserRegistrationException;
import model.User;
import ws.UserEndPoint;
import ws.WSEndPoint;


/**
 * Session Bean implementation class RegistrationBean
 */

@LocalBean
@Path("/user")

public class AuthBean {
	
	@EJB UserEndPoint uep;
	@Context private HttpServletRequest request;


    /**
     * Default constructor. 
     */
    public AuthBean() {
        // TODO Auto-generated constructor stub
    }
    
	@POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
    public String registerUser(User user) throws UserRegistrationException  {
        for (User u : UsersData.getInstance().getAllUsers()) {
            if (u.getUsername().equals(user.getUsername())) throw new UserRegistrationException();
        }
        UsersData.getInstance().getAllUsers().add(user);
        System.out.println("New user registered");
        return "{status: Registered successfully}";
    }
	
	@POST
	@Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public String login(User user) {
		for (User currentUser : UsersData.getInstance().getAllUsers()) {
            if (user.getUsername().equals(currentUser.getUsername()) && user.getPassword().equals(currentUser.getPassword())) {
                                
                for(User onlineUser : UsersData.getInstance().getOnlineUsers()) {
                	if(onlineUser.getUsername().equals(currentUser.getUsername())) {
            			return "Already logged in";
                	}
                }
                UsersData.getInstance().getOnlineUsers().add(user);
    				return "Logged in successfully";

            }
		}
		
		return "Logging in failed";

	}
	
	@DELETE
	@Path("/logout")
    @Consumes(MediaType.APPLICATION_JSON)
    public void logout(User user) {
        User userFound = null;
        for (User currentUser : UsersData.getInstance().getOnlineUsers()) {
            if (user.getUsername().equals(currentUser.getUsername())) {
                        userFound = currentUser;
            }
        }
                  
        if (userFound != null) {
        	UsersData.getInstance().logout(userFound);
        	System.out.println("Uspesno izlogovan");
        	uep.close(user.getUsername());
        }

    }
	
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<String> getAllOnlineUsers(){
		ArrayList<String> returnValue = new ArrayList<>();
		for(User currentUser : UsersData.getInstance().getOnlineUsers()) {
			returnValue.add(currentUser.getUsername());
		}
	return returnValue;
	}
	
	@GET
	@Path("/isLoggedIn/{username}")
	public String isLoggedIn(@PathParam("username") String username){
		Boolean flag = false;
		for(User tmp : UsersData.getInstance().getAllUsers()) {
			if(tmp.getUsername().equals(username)) {
				flag = true;
				break;
			}	
		}
		if(flag)
			return "Korisnik je ulogovan";
		
		else
			return "Korisnik nije ulogovan";
	}
}
