package agents;

import javax.ejb.Stateful;

import jms.JMSQueue;
import model.ACLMessage;
import model.AID;
import model.Agent;
import model.Performative;

@Stateful
public class Pong extends Agent {

	@Override
	public void handleMessage(ACLMessage message) {
		System.out.println("Pong has recived messages:" + message);
		if (message.getPerformative().equals(Performative.REQUEST)) {
			ACLMessage aclPoruka = new ACLMessage();
			aclPoruka.setSender(this.getId());
			aclPoruka.setReceivers(new AID[] { message.getSender() });
			aclPoruka.setConversationId(message.getConversationId());
			aclPoruka.setContent("Pong je odgovorio");
			aclPoruka.setPerformative(Performative.INFORM);
			new JMSQueue(aclPoruka);
		}
	}
}