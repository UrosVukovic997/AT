import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {VehicleService} from '../../@core/services/vehicle.service';
import {MyAdsService} from '../../@core/services/my-ads.service';


@Component({
  selector: 'app-new-ad',
  templateUrl: './new-ad.component.html',
  styleUrls: ['./new-ad.component.scss']
})
export class NewAdComponent implements OnInit {

  AdForm: FormGroup;
  vehicles: any = [];

  public imagePath;
  imgURLS: any[] = [];
  public message: string;
  selectedFiles: Blob[] = [];

  constructor(private formBuilder: FormBuilder, private adService: MyAdsService) {
  }

  ngOnInit(): void {
    this.AdForm = this.formBuilder.group({
      agent: [''],
      name: [''],
    });
  }

  submit() {
    this.adService.createAd(this.AdForm.value).subscribe(); }
}
