import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DOCUMENT, formatDate} from '@angular/common';
import {ReservationsService} from '../../@core/services/reservations.service';
import {MessageService} from '../../@core/services/message.service';
import {LoginService} from '../../@core/services/login.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {


  conversations: any = [];
  online: any = [];

  selected = '';
  conID;
  curentuser = '';
  messages: any = [];
  constructor( @Inject(DOCUMENT) document, private router: Router, private reservationsService: ReservationsService,
               private messageService: MessageService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.myInfo().subscribe(
      myInfo => {
        this.curentuser = myInfo.username;
        this.reservationsService.getAllReservations(myInfo.userId).subscribe(
          data => {
            this.messageService.getConversations().subscribe(data2 => {
              console.log(data2);
              for (const tmp of data) {
                for (const tmp2 of data2) {
                  if (tmp.id === tmp2.orderId){
                    this.messageService.getUser(tmp.userId).subscribe(userData => {

                      const user = {
                        id : tmp2.id,
                        username : userData.username
                      };
                      this.online.push(user);
                      console.log(this.online);

                    });
                  }
                }
              }
            });
          }
        );
      }
    );

    this.loadMessages();

    }

    loadMessages() {
      this.messageService.getMassages().subscribe(mesData => {
        this.messages = mesData;
        console.log('messages: ' + mesData);
      });
    }


  proba(a) {
    console.log(a);
    this.selected = a.username;
    this.conID = a.id;
  }

  send() {
    console.log('okidaa');
    const message = {
      fromUser: this.curentuser,
      toUser: this.selected,
      content: (document.getElementById('messageField')as HTMLInputElement).value,
      conversationId: this.conID
    };
    this.messageService.sendMessage(message).subscribe(
      Dt => {
        this.loadMessages();
      }
    );
    console.log('sent : ' + message);
  }
}
