import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {ReservationsService} from '../../@core/services/reservations.service';
import {LoginService} from '../../@core/services/login.service';
import {NbDateService, NbWindowService} from '@nebular/theme';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.scss']
})
export class NewReservationComponent implements OnInit {

  id;
  @ViewChild('disabledEsc', { read: TemplateRef, static: true }) disabledEscTemplate: TemplateRef<HTMLElement>;

  settings1 = {
    hideSubHeader: true,
    actions: {
      custom: [
        {
          name: 'finish',
          title: '<i class="ion-checkmark-round" title="Accept"></i>'
        },

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

  source1: LocalDataSource = new LocalDataSource();

  settings2 = {
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      id: {
        title: 'Reservation ID',
        type: 'number',
      },
      userId: {
              title: 'Client',
              type: 'number',
            },
      startTime: {
        title: 'Start date',
        type: 'string',
      },
      endTime: {
        title: 'End date',
        type: 'string',
      },
      predjenaKM: {
        title: 'KM',
        type: 'string',
      },
      opis: {
        title: 'Description',
        type: 'string',
      },
    },
  };

  source2: LocalDataSource = new LocalDataSource();
  ReerveForm: FormGroup;


  constructor(private service: ReservationsService, private auth: LoginService, protected dateService: NbDateService<Date>,
              private formBuilder: FormBuilder, private reservationService: ReservationsService, private windowService: NbWindowService) {

  }

  loadRes1(data){
    console.log(data);
    for (const item of data) {
      if (item.state !== 'Pending') {
        const date = this.dateService.parse(item.endTime, 'DD.MM.YYYY');
        const nowDate = this.dateService.today();

        // if (item.)
        if (!item.arhivirano) {
          const tmp = {
            id: item.id,
            startTime: item.startTime,
            endTime: item.endTime,
          };
          this.source1.add(tmp);
          this.source1.refresh();
        }
        else{
          const tmp = {
            id: item.id,
            startTime: item.startTime,
            endTime: item.endTime,
            opis: item.opis,
            predjenaKM: item.predjenaKM,
            userId: item.userId
          };
          this.source2.add(tmp);
          this.source2.refresh();
        }
      }
    }
    console.log(this.source1);
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

    this.ReerveForm = this.formBuilder.group({
      opis: [''],
      predjenaKM: [''],
    });

  }

  getMyReservations(id) {
    this.service.getAllReservations(id).subscribe((data: {}) => {
        this.loadRes1(data);
        console.log(data);
        this.source1.refresh();
      }
    );
  }

  onReserve(event) {
    console.log(event);
    if (event.action === 'finish'){
      this.id = event.data.id;
      this.openWindowWithoutBackdrop();
    }
  }

  submit() {
    this.reservationService.updateOpis(this.id, this.ReerveForm.value).subscribe();
  }

  openWindowWithoutBackdrop() {
    this.windowService.open(
      this.disabledEscTemplate,
      {
        title: 'Add details',
        hasBackdrop: false,
        closeOnEsc: true,
      },
    );
  }
}
