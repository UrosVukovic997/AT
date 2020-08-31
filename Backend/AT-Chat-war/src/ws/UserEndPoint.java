package ws;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.ejb.LocalBean;
import javax.ejb.Singleton;
import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.JsonObject;

@Singleton
@ServerEndpoint("/users/{user}")
@LocalBean
public class UserEndPoint {

	static Map<String, Session> sessions = new ConcurrentHashMap<>();

	@OnOpen
	public void onOpen(@PathParam("user") String user, Session session) {
		sessions.put(user, session);
		this.newOnline(user);
	}
	
	
	@OnMessage
	public void echoTextMessage(String msg) {
		
	}
	
	private void newOnline(String username) {
		for(Map.Entry<String, Session> entry : sessions.entrySet()) {
			if(entry.getKey().equals(username))
				continue;
			try {
				JsonObject innerObject = new JsonObject();
				innerObject.addProperty("akcija", "ulogovan");
				innerObject.addProperty("user", username);
				entry.getValue().getBasicRemote().sendText(innerObject.toString());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	@OnClose
	public void onClose(@PathParam("user") String user, Session session, CloseReason closeReason) {
		// TODO Auto-generated method stub
		System.out.println("Gasenje ws conekcije");
		sessions.remove(user);
		this.close(user);
		
	}
	

	public void close(String user) {
		// TODO Auto-generated method stub
		for(Map.Entry<String, Session> entry : sessions.entrySet()) {
			try {
				JsonObject innerObject = new JsonObject();
				innerObject.addProperty("akcija", "izlogovan");
				innerObject.addProperty("user", user);
				entry.getValue().getBasicRemote().sendText(innerObject.toString());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}
	
}