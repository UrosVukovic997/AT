package rest;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;

import com.google.gson.Gson;

import agents.Initiator;
import agents.Participant;
import agents.Ping;
import agents.Pong;
import data.NetworkData;
import jms.JMSQueue;
import model.ACLMessage;
import model.AID;
import model.Agent;
import model.AgentCenter;
import model.AgentType;
import model.Performative;
import ws.WSEndPoint;

@LocalBean
@Path("")
public class AgentRest {
	@EJB
	NetworkData database;

	@EJB
	WSEndPoint ws;

	// GET/messages � dobavi listu performativa
		@GET
		@Path("/messages")
		@Produces(MediaType.APPLICATION_JSON)
		public List<Performative> getPerformative() {
			ArrayList<Performative> temp = new ArrayList<Performative>();
			for (Performative p : Performative.values()) {
				temp.add(p);
			}
			return temp;
		}

		// POST /messages � po�alji ACL poruku;
		@POST
		@Path("/messages")
		@Produces(MediaType.APPLICATION_JSON)
		public void sendMessage(ACLMessage aclPoruka) {
			new JMSQueue(aclPoruka);
		}

		// GET /agents/classes � dobavi listu svih tipova agenata na sistemu
		@GET
		@Path("/agents/classes")
		@Produces(MediaType.APPLICATION_JSON)
		public List<AgentType> getTipovi() {
			System.out.println("TIPOVI---" + database.getTypes());
			return database.getTypes();
		}

		// GET /agents/running � dobavi sve pokrenute agente sa sistema
		@GET
		@Path("/agents/running")
		@Produces(MediaType.APPLICATION_JSON)
		public ArrayList<Agent> getAgents() {

			return new ArrayList<>(database.getAgents().values());
		}

		// DELETE /agents/running/{aid} � zaustavi odredjenog agenta
		@DELETE
		@Path("/agents/running/{aid}")
		public void stopAgent(@PathParam("aid") String aid) {
			System.out.println("Treba da obrisem " + aid);
			HashMap<String, Agent> agenti = database.getAgents();
			HashMap<String, Agent> temp = new HashMap();
			for (String a : agenti.keySet()) {
				// System.out.println(agenti.get(a).getId().getHost().getAddress());
				if (!agenti.get(a).getId().getHost().getAddress().contains(aid)) {
					temp.put(a, agenti.get(a));
				}
			}
			database.setAgents(temp);
			String msg = "";
			Gson gson = new Gson();
			for(Agent a : database.getAgents().values()) {
				msg += gson.toJson(a);
			}
			ws.echoTextMessage(msg);

		}

		// PUT /agents/running/{type}/{name} � pokreni agenta odredenog tipa sa zadatim
		// imenom;
		@PUT
		@Path("/agents/running/{type}/{name}")
		public void startAgent(@PathParam("type") String type, @PathParam("name") String name) {

			System.out.println("Primam novi running cvor");
			String currentIp = "";
			BufferedReader br = null;
			java.nio.file.Path p = Paths.get(".").toAbsolutePath().normalize();
			String line = "";

			try {
				br = new BufferedReader(new FileReader(p.toString() + "\\config.txt"));

				StringBuilder sb = new StringBuilder();
				while (line != null) {
					sb.append(line);
					sb.append(System.lineSeparator());
					try {
						line = br.readLine();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				currentIp = sb.toString();
			} catch (FileNotFoundException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

			currentIp = currentIp.substring(2, currentIp.length() - 2);
			AgentCenter host = new AgentCenter("8080", currentIp);

			try {
				Context context = new InitialContext();
				switch (type) {
				case "Ping":
					Ping ping = new Ping();
					AID a = new AID(name, host, new AgentType(type,null));
					ping.setId(a);
					database.getAgents().put(ping.getId().getName(), ping);
					break;
				case "Pong":
					Pong pong = new Pong();
					AID a1 = new AID(name, host, new AgentType(type,null));
					pong.setId(a1);
					database.getAgents().put(pong.getId().getName(), pong);
					break;
				case "Initiator":
					Initiator initiator = new Initiator();
					AID a2 = new AID(name, host, new AgentType(type,null));
					initiator.setId(a2);
					database.getAgents().put(initiator.getId().getName(), initiator);
					break;
				case "Participant":
					Participant participant = new Participant();
					AID a3 = new AID(name, host, new AgentType(type,null));
					participant.setId(a3);
					database.getAgents().put(participant.getId().getName(), participant);
					break;
				default:
					break;
				}
				
				String msg = "";
				Gson gson = new Gson();
				for(Agent a : database.getAgents().values()) {
					msg += gson.toJson(a);
				
				}
				ws.echoTextMessage(msg);

				for (AgentCenter at : database.getAgentskiCentri()) {
					if (at.getAddress().equals(currentIp))
						continue;
					ResteasyClient client2 = new ResteasyClientBuilder().build();
					ResteasyWebTarget rtarget2 = client2.target(at.getAddress() + "/AT-Chat-war/rest/node/agents/running");
					System.out.println(database.getAgents());
					Response response2 = rtarget2.request(MediaType.APPLICATION_JSON)
							.post(Entity.entity(database.getAgents(), MediaType.APPLICATION_JSON));

				}
			} catch (NamingException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

		}
}
