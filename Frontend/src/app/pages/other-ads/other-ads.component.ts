import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LocalDataSource} from 'ng2-smart-table';
import {MyAdsService} from '../../@core/services/my-ads.service';
import {NbDateService, NbWindowService} from '@nebular/theme';
import {ReservationsService} from '../../@core/services/reservations.service';
import {VehicleService} from '../../@core/services/vehicle.service';

@Component({
  selector: 'app-other-ads',
  templateUrl: './other-ads.component.html',
  styleUrls: ['./other-ads.component.scss']
})
export class OtherAdsComponent implements OnInit {
  @ViewChild('disabledEsc', {read: TemplateRef, static: true}) disabledEscTemplate: TemplateRef<HTMLElement>;
  @ViewChild('commentsWin', {read: TemplateRef, static: true}) commentsTemplate: TemplateRef<HTMLElement>;

  id;
  min: Date;
  max: Date;
  messages: any = [];
  settings = {
    hideSubHeader: true,
    actions: {
      custom: [
        {
          name: 'reserve',
          title: '<i class="ion-document" title="Manual reservation"></i>'
        },
        {
          name: 'comments',
          title: '<i class="ion-clipboard" title="Comments"></i>'
        }
      ],
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      vehicle: {
        title: 'Vehicle',
        type: 'number',
      },
      oil: {
        title: 'Oil',
        type: 'number',
      },
      gear: {
        title: 'Gear',
        type: 'number',
      },
      startTime: {
        title: 'Start date',
        type: 'string',
      },
      endDate: {
        title: 'End date',
        type: 'string',
      },
      location: {
        title: 'Location',
        type: 'string',
      },
      cena: {
        title: 'Price',
        type: 'string',
      },
      vote: {
        title: 'Vote',
        type: 'number',
      }
    },
  };
  ReerveForm: FormGroup;
  source: LocalDataSource = new LocalDataSource();


  constructor(private service: MyAdsService, private windowService: NbWindowService, protected dateService: NbDateService<Date>,
              private formBuilder: FormBuilder, private reservationService: ReservationsService, private vehicleService: VehicleService) {

  }

  loadAds(data) {
    for (const item of data) {
      let vehicle = null;
      this.vehicleService.getVehicle(item.vehicleId).subscribe(data2 => {
        vehicle = data2;
        console.log(vehicle);
        let ukupnaOcena = 0;
        let i = 0;
        for (const vote of item.votes) {
          if (vote.approved === true){
            i++;
            ukupnaOcena += vote.vrednost;
          }
        }
        const ocena = ukupnaOcena / item.votes.length;

        const tmp = {
          id: item.id,
          vehicleId: item.vehicleId,
          vehicle: vehicle.vendor + ' ' + vehicle. model,
          oil: vehicle.oilType,
          gear: vehicle.gearType,
          startTime: item.startTime,
          endDate: item.endDate,
          location: item.location,
          cena: item.cena,
          comments: item.comments,
          vote: ocena
        };
        this.source.add(tmp);
        this.source.refresh();


        }
      );
    }
    console.log(this.source);
    console.log('2');
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit(): void {
    this.service.getAll().subscribe((data: {}) => {
        this.loadAds(data);
        console.log(data);
        this.source.refresh();
      }
    );

    this.ReerveForm = this.formBuilder.group({
      startTime: [''],
      endTime: [''],
    });
  }

  onReserve(event) {
    console.log(event);
    if (event.action === 'reserve') {
      console.log('reserve');
      this.id = event.data.id;
      this.min = this.dateService.parse(event.data.startTime, 'DD.MM.YYYY');
      this.max = this.dateService.parse(event.data.endDate, 'DD.MM.YYYY');
      this.openWindowWithoutBackdrop();
    } else if (event.action === 'delete') {
      console.log('delete');
    } else if (event.action === 'comments') {
      this.messages = event.data.comments;
      this.commentsWindows();
    }
  }


  openWindowWithoutBackdrop() {
    this.windowService.open(
      this.disabledEscTemplate,
      {
        title: 'Manual reservation',
        hasBackdrop: false,
        closeOnEsc: true,
      },
    );
  }

  submit() {
    this.reservationService.reserve(this.id, this.ReerveForm.value).subscribe();
  }


  commentsWindows() {
    this.windowService.open(
      this.commentsTemplate,
      {
        title: 'Comments',
        hasBackdrop: false,
        closeOnEsc: true,
      },
    );
  }
}
