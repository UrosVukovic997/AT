import {PagesComponent} from './pages.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MyAdsComponent} from './my-ads/my-ads.component';
import {NewAdComponent} from './new-ad/new-ad.component';
import {NewVehicleComponent} from './new-vehicle/new-vehicle.component';
import {ReservationsComponent} from './reservations/reservations.component';
import {NewReservationComponent} from './new-reservation/new-reservation.component';
import {ProfileComponent} from './profile/profile.component';
import {StatsComponent} from './stats/stats.component';
import {ChatComponent} from './chat/chat.component';
import {VehiclesComponent} from './vehicles/vehicles.component';
import {OtherAdsComponent} from './other-ads/other-ads.component';
import {DiscountsComponent} from './discounts/discounts.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      component: StatsComponent,
    },
    {
      path: 'my-ads',
      component: MyAdsComponent,
    },
    {
      path: 'new',
      component: NewAdComponent,
    },
    {
      path: 'pingpong',
      component: NewVehicleComponent,
    },
    {
      path: 'reservations',
      component: ReservationsComponent,
    },
    {
      path: 'reserve',
      component: NewReservationComponent,
    },
    {
      path: 'profile',
      component: ProfileComponent,
    },
    {
      path: 'messages',
      component: ChatComponent,
    },
    {
      path: 'vehicles',
      component: VehiclesComponent,
    },
    {
      path: 'other-ads',
      component: OtherAdsComponent,
    },
    {
      path: 'discounts',
      component: DiscountsComponent,
    },
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
