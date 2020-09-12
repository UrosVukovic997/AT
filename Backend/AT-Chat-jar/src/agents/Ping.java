package agents;

import javax.ejb.Stateful;

import model.ACLMessage;
import model.AID;
import model.Agent;
import model.Performative;

@Stateful
public class Ping extends Agent {

	@Override
	public void handleMessage(ACLMessage message) {
		System.out.println("Ping has rcived message, well see what it does. " + message);
		if (message.getPerformative().equals(Performative.REQUEST)) {
			ACLMessage aclPoruka = new ACLMessage();
			aclPoruka.setSender(this.getId());
			aclPoruka.setReceivers(new AID[] { message.getSender() });
			aclPoruka.setConversationId(message.getConversationId());
			aclPoruka.setPerformative(Performative.INFORM);
			aclPoruka.setContent("vratio");
			// JMSQueue(aclPoruka);
		} else if (message.getPerformative().equals(Performative.INFORM)) {
			System.out.println("Pong has responded, awesome.");
		}
	}

}
