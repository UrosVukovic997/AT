package beans;

import java.util.ArrayList;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import data.MessageData;
import model.Message;
import ws.WSEndPoint;

/**
 * Session Bean implementation class MessageBean
 */
@LocalBean
@Path("/message")
public class MessageBean {


    /**
     * Default constructor. 
     */
    public MessageBean() {
        // TODO Auto-generated constructor stub
    }

    
	@POST
    @Path("/send")
    @Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
    public String registerUser(Message msg)  {
        MessageData.getInstance().getMessages().add(msg);
        return "Message sended";
    }
	
	@GET
	@Path("/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Message> getMessages(@PathParam("username") String username){
		System.out.println("sve poruke: "+ username);
		ArrayList<Message> returnValue = new ArrayList<>();
		for(Message message : MessageData.getInstance().getMessages()) {
			if(message.getReceiver().equals(username) || message.getSender().equals(username) || message.getReceiver().equals("All"))
				returnValue.add(message);
		}
	return returnValue;
	}
	
}
