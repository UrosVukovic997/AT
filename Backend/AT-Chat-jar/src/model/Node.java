package model;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ws.rs.Path;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;

import com.sun.org.apache.bcel.internal.generic.ATHROW;

import data.NetworkData;

@Singleton
@Startup
@Path("/")
public class Node {
	private String currentIp;
	private String masterIp = "http://c57d25d312c4.ngrok.io";
	@EJB
	NetworkData database;

	Runnable heartbeat = () -> {
		while (true) {
			System.out.println("Broj uvezanih cvorova :" + database.getAgentskiCentri().size());
			for (AgentCenter at : database.getAgentskiCentri()) {
				if (at.getAddress().equals(this.currentIp))
					continue;
				
				ResteasyClient client5 = new ResteasyClientBuilder().build();
				ResteasyWebTarget rtarget5 = client5.target(at.getAddress() + "/AT-Chat-war/rest/node/node");
				
				try {
					System.out.println(at.getAddress() + "--------HB1");
					Response response5 = rtarget5.request().get();
					if(response5.getStatus() == 502) {
						try {
							System.out.println(response5.getStatus() + "--------HB2");
							response5 = rtarget5.request().get();
							
						} catch (Exception e1) {	
							System.out.println("Umro je cvor: " + at.getAddress());
							List<AgentCenter> currentAT = new ArrayList<>();
							for(AgentCenter a : database.getAgentskiCentri()) {
								if(!a.getAddress().equals(at.getAddress())) {
									currentAT.add(a);								
								}
							}	
							String del = at.getAddress().split("//")[1];
							ResteasyClient clientDelete = new ResteasyClientBuilder().build();
							ResteasyWebTarget rtargetDelete = clientDelete.target(this.masterIp
									+ "/ATProjectWAR/rest/agents/running/" + del);
							Response responseDelete = rtargetDelete.request().delete();
							System.out.println(this.masterIp+ "/AT-Chat-war/rest/agents/running/" + del+" -->"+responseDelete.getStatus());
							
							database.setAgentskiCentri((ArrayList<AgentCenter>) currentAT);
							for (AgentCenter atDelete : database.getAgentskiCentri()) {
								if (atDelete.getAddress().equals(this.currentIp))
									continue;
								System.out.println("DELETE");
								ResteasyClient client6 = new ResteasyClientBuilder().build();
								ResteasyWebTarget rtarget6 = client6.target(atDelete.getAddress()
										+ "/AT-Chat-war/rest/node/node/" + at.getAddress());
								Response response6 = rtarget6.request(MediaType.APPLICATION_JSON).delete();
								
								
								
								
							}
						}
					}
				} catch (Exception e) {
					System.out.println("EVO ME U CATCH1");

				}
			}

			try {
				TimeUnit.SECONDS.sleep(20);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

		}
	};

	Runnable task = () -> {

		try {
			TimeUnit.SECONDS.sleep(5);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		notifyMaster(this.currentIp);

	};

	@PostConstruct
	public void init() {
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
		System.out.println("MasterIP : " + masterIp);
		System.out.println("CurrentIP : " + currentIp);
		
		if (!currentIp.equals(masterIp)) {
			Thread thread = new Thread(task);
			thread.start();
		} else {
			database.getAgentskiCentri().add(new AgentCenter("8080", this.currentIp));
		}
		Thread thread1 = new Thread(heartbeat);
		thread1.start();
	}

	public void notifyMaster(String connection) {
		// – nov ne-master cvor kontaktira master cvor koji ga registruje
		ResteasyClient client = new ResteasyClientBuilder().build();
		AgentCenter a = new AgentCenter("8080", connection);
		ResteasyWebTarget rtarget = client.target(masterIp + "/AT-Chat-war/rest/node/register");
		Response response = rtarget.request(MediaType.APPLICATION_JSON)
				.post(Entity.entity(a, MediaType.APPLICATION_JSON));
		return;

	}
}