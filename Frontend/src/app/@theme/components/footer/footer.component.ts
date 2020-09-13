import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created by XMLBoys for XML project 2020
    </span>
    <div class="socials">
      <a href="https://github.com/XML-boys/project/" target="_blank" class="ion ion-social-github"></a>

    </div>
  `,
})
export class FooterComponent {
}
