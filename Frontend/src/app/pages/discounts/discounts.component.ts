import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {VehicleService} from '../../@core/services/vehicle.service';
import {DiscountsService} from '../../@core/services/discounts.service';
import {HttpClient} from '@angular/common/http';
import {LocalDataSource} from 'ng2-smart-table';
import {LoginService} from '../../@core/services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit {
  AdForm: FormGroup;
  vehicles: any = [];

  settings = {
    hideSubHeader: true,
    actions: {
      custom: [
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
      vehicle: {
        title: 'Vehicle',
        type: 'number',
      },
     percent: {
        title: 'Percent',
        type: 'string',
      },
      days: {
        title: 'For mor then:',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private formBuilder: FormBuilder, private vehicleService: VehicleService, private disService: DiscountsService,
              private router: Router) { }

  ngOnInit(): void {
    this.AdForm = this.formBuilder.group({
      vehicle: [''],
      percent: [''],
      days: [''],
    });

    this.vehicleService.getAllVehicle().subscribe((data: {}) => {
      this.vehicles = data;
    });

    this.disService.getDis().subscribe((data: {}) => {
        this.loadAds(data);
        console.log(data);
        this.source.refresh();
      }
    );
  }

  submit() {
    this.disService.createDis(this.AdForm.value).subscribe(
      data => {
        this.router.navigate(['/agent']);
        this.router.navigate(['/agent/dashboard/discounts']);
      }
    ); }

  loadAds(data){
    console.log(data);
    for (const item of data) {
      const tmp = {
        id: item.id,
        vehicle: item.vehicle,
        percent: item.percent,
        days: item.days,
      };
      this.source.add(tmp);
      this.source.refresh();
    }
    console.log(this.source);
  }

  onReserve(event) {
    if (event.action === 'delete'){
      this.disService.deleteDis(event.data.id).subscribe(Response => {
        this.router.navigate(['/agent']);
        this.router.navigate(['/agent/dashboard/discounts']);
        }
      );
    }
  }

}
