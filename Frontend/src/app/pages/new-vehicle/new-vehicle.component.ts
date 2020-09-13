import {Component, Inject, OnInit} from '@angular/core';
import {VehicleService} from '../../@core/services/vehicle.service';
import {DOCUMENT} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-vehicle',
  templateUrl: './new-vehicle.component.html',
  styleUrls: ['./new-vehicle.component.scss']
})
export class NewVehicleComponent implements OnInit {

  VehicleForm: FormGroup;
  performatives: any = [];
  senders: any = [];
  receivers: any = [];
  text = '';

  constructor(private vehicleService: VehicleService, private formBuilder: FormBuilder) {

    vehicleService.messages.subscribe(msg => {
      let tmp = '';
      for (const rec of msg.receivers){
        tmp += rec.name + '(' + rec.type.name + '),';
      }
      console.log(msg.performative + ' from: ' + msg.sender.name + '(' + msg.sender.type.name + ') to: ' + tmp
        + ' content: ' + msg.content);
      this.text += msg.performative + ' from: ' + msg.sender.name + '(' + msg.sender.type.name + ') to: ' + tmp
        + ' content: ' + msg.content + '\n';
    });
  }

  ngOnInit(): void {

  this.VehicleForm  =  this.formBuilder.group({
    performative: [''],
    sender: [''],
    receivers: [''],
    content: [''],
  });

  this.senders = [];
  this.vehicleService.getAllVendors().subscribe((data: {}) => {
    this.performatives = data;
  });
  this.vehicleService.getModelsByVendor().subscribe((data: {}) => {
    this.senders = data;
    this.receivers = data;
  });
  }

  get formControls() { return this.VehicleForm.controls; }

  submit() {
  this.vehicleService.addVehicle(this.VehicleForm.value).subscribe((data: {}) => {console.log(data); });
  console.log(this.VehicleForm.value);
  }
}
