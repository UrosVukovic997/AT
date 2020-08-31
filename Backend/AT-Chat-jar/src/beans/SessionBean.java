package beans;

import java.util.Timer;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ws.rs.Path;

import data.NetworkData;
import model.Host;

@Singleton
@LocalBean
@Path("/host")
@Startup
public class SessionBean {

	@EJB
	NetworkData data;
	private String masterAddress;

	// need this for preDestroy
	private Host currentNode;

	private Timer timer;
}
