import { Component, OnInit } from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {MyAdsService} from '../../@core/services/my-ads.service';
import {ReservationsService} from '../../@core/services/reservations.service';
import {LoginService} from '../../@core/services/login.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

  settings = {
    hideSubHeader: true,
    actions: {
      custom: [
        {
          name: 'reserve',
          title: '<i class="ion-checkmark-round" title="Accept"></i>'
        },
        {
          name: 'delete',
          title: '<i class="ion-close-round" title="delete"></i>'
        }
      ],
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      id: {
        title: 'Reservation ID',
        type: 'number',
      },
/*      adId: {
        title: 'Ad ID',
        type: 'number',
      },
*/      startTime: {
        title: 'Start date',
        type: 'string',
      },
      endTime: {
        title: 'End date',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();


  constructor(private service: ReservationsService, private auth: LoginService) {

  }

  loadAds(data){
    console.log(data);
    for (const item of data) {
      if (item.state === 'Pending') {
        const tmp = {
          id: item.id,
          // adId: item.reklama.id,
          startTime: item.startTime,
          endTime: item.endTime,
          //  location: item.reklama.location,
        };
        this.source.add(tmp);
      }
    }
    console.log(this.source);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit(): void {
    let myInfo;
    this.auth.myInfo().subscribe((data: {}) => {
      myInfo = data;
      this.getMyReservations(myInfo.userId);
    });

  }

  getMyReservations(id) {
    this.service.getAllReservations(id).subscribe((data: {}) => {
        this.loadAds(data);
        console.log(data);
        this.source.refresh();
      }
    );
  }

  onReserve(event) {
    console.log(event);
    if (event.action === 'reserve'){
      this.service.acceptRes(event.data.id, 'Reserved').subscribe();
    }
    else if (event.action === 'delete'){
      this.service.acceptRes(event.data.id, 'Declined').subscribe();
    }
  }

}
