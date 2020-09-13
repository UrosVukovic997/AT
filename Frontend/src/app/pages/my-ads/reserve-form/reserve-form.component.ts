import { Component, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import {FormsModule} from '@angular/forms';
@Component({
  templateUrl: './reserve-form.component.html',
  styleUrls: ['./reserve-form.component.scss']
})
export class ReserveFormComponent {

  constructor(public windowRef: NbWindowRef) {}

  close() {
    this.windowRef.close();
  }
}
