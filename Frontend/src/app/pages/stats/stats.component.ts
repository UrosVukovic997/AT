import { Component, OnInit } from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {MyAdsService} from '../../@core/services/my-ads.service';
import {VehicleService} from '../../@core/services/vehicle.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      id: {
        title: 'Vehicle id',
        type: 'number',
      },
      name: {
        title: 'Vehicle',
        type: 'number',
      },
      distance: {
        title: 'Distance',
        type: 'string',
      },
      grade: {
        title: 'Grade',
        type: 'string',
      },
      coments: {
        title: 'Comments',
        type: 'string',
      },
      ads: {
        title: 'Ads for this vehicle',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  vehicles: any = [];
  ads: any = [];
  stats = [];

  constructor(private vehicleService: VehicleService, private adService: MyAdsService) {

  }
/*
  fill(){
    for (const veh of this.vehicles) {

  }

  loadAds(){
    for (const veh of this.vehicles) {
      const tmp = {
        id: veh.id,
        name: veh.vendor,
        distance: veh.distanceKM,
        grade: veh.votes,
        cena: item.cena,
      };
      this.source.add(tmp);

    }
    console.log(this.source);
  }

*/


  loadAds(data) {
    for (const item of data) {
    // let vehicle = null;
      this.adService.getAllByVehicle(item.id).subscribe((data2: {}) => {
        this.ads = data2;
        let ukupnaOcena = 0;
        let i = 0;
        let commentLenght = 0;
        for (const dat of this.ads) {
          for (const vote of dat.votes) {
            if (vote.approved === true) {
              i++;
              ukupnaOcena += vote.vrednost;
            }
          }
          commentLenght += dat.comments.length;
        }
        const ocena = ukupnaOcena / i;
        const tmp = {
          id: item.id,
          name: item.vendor + ' ' + item. model + ' ' + item.vehicleClass,
          distance: item.distanceKM,
          grade: ocena,
          coments: commentLenght,
          ads: this.ads.length
        };
        this.source.add(tmp);
        this.source.refresh();


      });
    }
    console.log(this.source);
    console.log('2');
  }
  ngOnInit(): void {
    this.vehicleService.getAllVehicle().subscribe( (data: {}) => {
      this.vehicles = data;
      this.loadAds(data);
    });
  }

}
