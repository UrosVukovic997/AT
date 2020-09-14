package data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.ejb.Startup;

import model.Agent;
import model.AgentCenter;
import model.AgentType;
import ws.WSEndPoint;


@Startup
@Singleton
public class NetworkData {
	@EJB
	private WSEndPoint ws;

	private static ArrayList<AgentType> types = new ArrayList<>();
	private static ArrayList<AgentCenter> agentskiCentri = new ArrayList<>();
	private static HashMap<String, Agent> agents = new HashMap<>();
	public static List<Agent> agenti = new ArrayList<>();
	
	static {

		AgentType a = new AgentType();
		a.setModule("abc");
		a.setName("Ping");
		types.add(a);

		AgentType a1 = new AgentType();
		a1.setModule("abc");
		a1.setName("Pong");
		types.add(a1);
		
		AgentType a2 = new AgentType();
		a2.setModule("abc");
		a2.setName("Initiator");
		types.add(a2);
		
		AgentType a3 = new AgentType();
		a3.setModule("abc");
		a3.setName("Participant");
		types.add(a3);
	}
	
	
	public WSEndPoint getWs() {
		return ws;
	}
	public void setWs(WSEndPoint ws) {
		this.ws = ws;
	}
	public static ArrayList<AgentType> getTypes() {
		return types;
	}
	public static void setTypes(ArrayList<AgentType> types) {
		NetworkData.types = types;
	}
	public static ArrayList<AgentCenter> getAgentskiCentri() {
		return agentskiCentri;
	}
	public static void setAgentskiCentri(ArrayList<AgentCenter> agentskiCentri) {
		NetworkData.agentskiCentri = agentskiCentri;
	}
	public static HashMap<String, Agent> getAgents() {
		return agents;
	}
	public static void setAgents(HashMap<String, Agent> agents) {
		NetworkData.agents = agents;
	}
	public static List<Agent> getAgenti() {
		return agenti;
	}
	public static void setAgenti(List<Agent> agenti) {
		NetworkData.agenti = agenti;
	}


	

}