import { Component, OnInit } from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {MyAdsService} from '../../@core/services/my-ads.service';
import {VehicleService} from '../../@core/services/vehicle.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: 'right'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'Ad ID',
        type: 'number',
      },
      vendor: {
        title: 'Brand',
        type: 'string',
      },
      model: {
        title: 'Model',
        type: 'string',
      },
      class: {
        title: 'Class',
        type: 'string',
      },
      distance: {
        title: 'Distance',
        type: 'string',
      },
      kidSeats: {
        title: 'Kid seats',
        type: 'string',
      },
      oil: {
        title: 'Oil Type',
        type: 'string',
      },
      gear: {
        title: 'Gear Type',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: VehicleService) {

  }

  loadAds(data){
    for (const item of data) {
      const tmp = {
        id: item.id,
        distance: item.distanceKM,
        kidSeats: item.kidSeats,
        oil: item.oilType,
        vendor: item.vendor,
        model: item.model,
        class: item.vehicleClass,
        gear: item.gearType,

      };
      this.source.add(tmp);

    }
    console.log(this.source);
  }

  onDeleteConfirm(event): void {
    console.log(event.data.id);
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteVehicle(event.data.id).subscribe();
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit(): void {
    this.service.getAllVehicle().subscribe((data: {}) => {
        this.loadAds(data);
        console.log(data);
        this.source.refresh();
      }
    );
  }
}
