import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { Settings, SettingsService } from '../../../../services/settings.service';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horizontal-menu',
  standalone: true,
  imports: [
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule
  ],
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HorizontalMenuComponent implements OnInit {
  @Input('menuParentId') menuParentId: any;
  public menuItems!: Array<any>;
  public settings: Settings;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  constructor(public settingsService: SettingsService, public router:Router) {
    this.settings = this.settingsService.settings;
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(this.settings.fixedHeader){
          let mainContent = document.getElementById('main-content');
          if(mainContent){
            mainContent.scrollTop = 0;
          }
        }
        else{
          document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        }
      }
    });
  }

  submenuVisible: boolean = false;
  onSubmenuClick() {
    this.submenuVisible = !this.submenuVisible;
  }
}
