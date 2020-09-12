package rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;

import data.NetworkData;
import model.AgentCenter;
import model.AgentType;
import ws.WSEndPoint;




@Singleton
@Startup
@Path("/node")
public class NodesRest {
	private String masterIp = "http://56e70053edca.ngrok.io";
	
	@EJB
	WSEndPoint ws;
	@EJB
	NetworkData database;

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public void notifyMaster(AgentCenter a) {

		System.out.println("Ja sam master i registrujem novi agentski centar");
		database.getAgentskiCentri().add(a);

		ResteasyClient client = new ResteasyClientBuilder().build();
		ResteasyWebTarget rtarget = client.target(a.getAddress() + "/ATProjectWAR/rest/node/nodes");
		Response response = rtarget.request(MediaType.APPLICATION_JSON)
				.post(Entity.entity(database.getAgentskiCentri(), MediaType.APPLICATION_JSON));
		System.out.println(database.getAgentskiCentri().toString());
		
		for (AgentCenter at : database.getAgentskiCentri()) {
			if (at.getAddress().equals(a.getAddress()) || at.getAddress().equals(masterIp))
				continue;
			System.out.println(at.getAddress() + " "+ a.getAddress());
			ResteasyClient client2 = new ResteasyClientBuilder().build();
			ResteasyWebTarget rtarget2 = client2
					.target(at.getAddress() + "/ATProjectWAR/rest/node/node");
			Response response2 = rtarget2.request(MediaType.APPLICATION_JSON)
					.post(Entity.entity(a, MediaType.APPLICATION_JSON));
		}
		
		ResteasyClient client3 = new ResteasyClientBuilder().build();
		ResteasyWebTarget rtarget3 = client3.target(a.getAddress() + "/ATProjectWAR/rest/node/agents/classes");
		Response response3 = rtarget3.request(MediaType.APPLICATION_JSON).get();
		List<AgentType> list = response3.readEntity(ArrayList.class);
		System.out.println("Primio sam nove tipove" + list);

		for (AgentCenter at : database.getAgentskiCentri()) {
			if (at.getAddress().equals(a.getAddress()) || at.getAddress().equals(masterIp))
				continue;
			ResteasyClient client4 = new ResteasyClientBuilder().build();
			ResteasyWebTarget rtarget4 = client4
					.target("http://" + at.getAddress() + ":8080/ATProjectWAR/rest/node/agents/classes");
			Response response4 = rtarget4.request(MediaType.APPLICATION_JSON)
					.post(Entity.entity(list, MediaType.APPLICATION_JSON));
		}
		ResteasyClient client5 = new ResteasyClientBuilder().build();
		ResteasyWebTarget rtarget5 = client5.target(a.getAddress() + "/ATProjectWAR/rest/node/agents/running");

		try {
			Response response5 = rtarget5.request(MediaType.APPLICATION_JSON)
					.post(Entity.entity(database.getAgents(), MediaType.APPLICATION_JSON));
		} catch (Exception e) {
			try {
				Response response5 = rtarget5.request(MediaType.APPLICATION_JSON)
						.post(Entity.entity(database.getAgents(), MediaType.APPLICATION_JSON));
			} catch (Exception e1) {
				for (AgentCenter at : database.getAgentskiCentri()) {
					if (at.getAddress().equals(a.getAddress()) || at.getAddress().equals(masterIp))
						continue;
					ResteasyClient client6 = new ResteasyClientBuilder().build();
					ResteasyWebTarget rtarget6 = client6
							.target(at.getAddress() + "/ATProjectWAR/rest/node/node/" + a.getAddress());
					Response response6 = rtarget6.request(MediaType.APPLICATION_JSON).delete();
				}
			}

		}

	}

	@POST
	@Path("/node")
	@Consumes(MediaType.APPLICATION_JSON)
	public void notifyAll(AgentCenter a) {
		System.out.println("Ja sam ne-master cvor i primam informaciju da je novi registrovan");
		database.getAgentskiCentri().add(a);
		return;
	}

	@POST
	@Path("/nodes")
	@Consumes(MediaType.APPLICATION_JSON)
	public void getNoMaster(ArrayList<AgentCenter> agents) {
		System.out.println("Trenutno sam u novom ne-masteru i primam nove cvorove");
		for (AgentCenter a : agents)
			database.getAgentskiCentri().add(a);
		return;
	}

	@GET
	@Path("/node")
	public Response turnOffNode() {
		System.out.println("Ziv");
		return Response.status(200).build();
	}

	@GET
	@Path("/agents/classes")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<AgentType> getAgents() {
		System.out.println("Trenutno sam u ne-masteru i vracam sve tipove");
		return database.getTypes();
	}

	@POST
	@Path("/agents/classes")
	@Consumes(MediaType.APPLICATION_JSON)
	public void receiveAgents(ArrayList<AgentType> agents) {
		System.out.println("Trenutno sam u novom ne-masteru i primam nove tipove koje mi je master poslao");
		for (AgentType a : agents)
			database.getTypes().add(a);
		return;
	}
/*
	@POST
	@Path("/agents/running")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response loggedIn(HashMap<String, Agent> runningAgents) {
		System.out.println("Sada sam u novom ne-masteru i dobijam spisak pokrenutih agenata");
		if (database.getAgents().size() == 0) {
			database.setAgents(runningAgents);			
		}
		else {
			for(String aid : runningAgents.keySet()) {
				database.getAgents().put(aid, runningAgents.get(aid));
			}
		}
			
			ObjectMapper mapper = new ObjectMapper();
			String msg = null;
			try {
				msg = mapper.writeValueAsString(database.getAgents().values());
			} catch (JsonGenerationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JsonMappingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			ws.echoTextMessage(msg);
		
		return Response.status(200).build();
	}
*/
	@DELETE
	@Path("/node/{alias}")
	@Consumes(MediaType.APPLICATION_JSON)
	public void deleteNode(@PathParam("alias") String alias) {
		System.out.println("Sada sam u ne-master cvoru i primio sam poruku koji je cvor neaktivan");
		for (AgentCenter a : database.getAgentskiCentri()) {
			if (a.getAddress() == alias) {
				database.getAgentskiCentri().remove(a);
				break;
			}
		}
	}

}
