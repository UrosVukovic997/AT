package data;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.AccessTimeout;
import javax.ejb.ConcurrencyManagement;
import javax.ejb.ConcurrencyManagementType;
import javax.ejb.LocalBean;
import javax.ejb.Singleton;

import model.AgentCenter;

@Singleton
@LocalBean
@ConcurrencyManagement(ConcurrencyManagementType.CONTAINER)
@AccessTimeout(value = 120000)
public class NetworkData {

	private List<AgentCenter> nodes = new ArrayList<>();
	private AgentCenter master;
	private AgentCenter thisNode;

	private int counter = 0;
	
	
	public NetworkData() {}


	public List<AgentCenter> getNodes() {
		return nodes;
	}


	public void setNodes(List<AgentCenter> nodes) {
		this.nodes = nodes;
	}


	public AgentCenter getMaster() {
		return master;
	}


	public void setMaster(AgentCenter master) {
		this.master = master;
	}


	public AgentCenter getThisNode() {
		return thisNode;
	}


	public void setThisNode(AgentCenter thisNode) {
		this.thisNode = thisNode;
	}


	public int getCounter() {
		return counter;
	}


	public void setCounter(int counter) {
		this.counter = counter;
	}


}