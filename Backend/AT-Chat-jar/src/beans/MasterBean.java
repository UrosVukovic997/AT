package beans;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.InetAddress;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Properties;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.JMSException;
import javax.jms.Topic;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.vfs.VirtualFile;

import data.NetworkData;
import model.AgentCenter;


public class MasterBean extends AgentCenter{

	/**
	 * 
	 */
	private static final long serialVersionUID = -2239237685478352728L;

/*	@EJB
	Data data; // data for agents and agent types
*/
	@EJB
	NetworkData networkData; // data for nodes

	private String masterAddress;

	private Connection connection;
	@Resource(lookup = "java:jboss/exported/jms/RemoteConnectionFactory")
	private ConnectionFactory connectionFactory;
	@Resource(lookup = "java:jboss/exported/jms/topic/publicTopic")
	private Topic defaultTopic;

	@PostConstruct
	public void postConstruction() {
		try {
			connection = connectionFactory.createConnection("guest", "guest.guest.1");
			System.out.println("Created a connection.");
		} catch (JMSException ex) {
			throw new IllegalStateException(ex);
		}
		System.out.println("Created AgentCenter!");
		// InetAddress inetAddress;
		// AgentCenter node = new AgentCenter();

		try {
			AgentCenter node = new AgentCenter();
			InetAddress inetAddress = InetAddress.getLocalHost();
			node.setAddress(inetAddress.getHostAddress());
			node.setAlias(inetAddress.getHostName() + networkData.getCounter());

			networkData.setThisNode(node);
			System.out.println("IP Address:- " + node.getAddress() + " alias: " + node.getAlias());

			try {
				File f = getFile(SessionBean.class, "", "connections.properties");
				FileInputStream fileInput;
				fileInput = new FileInputStream(f);
				Properties properties = new Properties();

				try {
					properties.load(fileInput);
					fileInput.close();
					this.masterAddress = properties.getProperty("master");

					if (this.masterAddress == null || this.masterAddress.equals("")) {
						System.out.println("master created");
						networkData.setMaster(node);
						this.masterAddress = node.getAddress();

					} else {
						System.out.println("slave created");
						handshake(node);
					}
				} catch (IOException e) {

					e.printStackTrace();
				}
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
		} catch (Exception e) {

			e.printStackTrace();
		}
	}
	
	
	public void handshake(AgentCenter node) {
		try {
			register(node);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Retrying handshake");
			try {
				register(node);
			} catch (Exception e1) {
				System.out.println("Handshake unsuccessful. Node not registered");
			}
		}
	}

	public void register(AgentCenter node) {
		System.out.println("Registering node:");
		ResteasyClient client = new ResteasyClientBuilder().build();

		ResteasyWebTarget target = client.target("http://" + this.masterAddress + ":8080/ChatAppWar/rest/master/node");
		Response response = target.request().post(Entity.entity(node, "application/json"));
		client.close();
		if (response.getStatus() == 200)
			System.out.println("Node registered");
		else
			System.out.println("Node with same alias already exists");
	}
	public static File getFile(Class<?> c, String prefix, String fileName) {
		File f = null;
		URL url = c.getResource(prefix + fileName);
		if (url != null) {
			if (url.toString().startsWith("vfs:/")) {
				try {
					URLConnection conn = new URL(url.toString()).openConnection();
					VirtualFile vf = (VirtualFile) conn.getContent();
					f = vf.getPhysicalFile();
				} catch (Exception ex) {
					ex.printStackTrace();
					f = new File(".");
				}
			} else {
				try {
					f = new File(url.toURI());
				} catch (URISyntaxException e) {
					e.printStackTrace();
					f = new File(".");
				}
			}
		} else {
			f = new File(fileName);
		}
		return f;
	}
}
