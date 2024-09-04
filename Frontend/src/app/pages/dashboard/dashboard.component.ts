import { BoardingComponent } from './boarding/boarding.component';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import $ from 'jquery';
import { DeboardingComponent } from './deboarding/deboarding.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    DeboardingComponent,
    BoardingComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  ngOnInit(): void {
    setTimeout(() => this.test());
    this.setActiveClassOnPageLoad();
  }

  test(): void {
    const tabsNewAnim = $('#navbarSupportedContent');
    const activeItemNewAnim = tabsNewAnim.find('.active');
    const activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    const activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    const itemPosNewAnimTop = activeItemNewAnim.position();
    const itemPosNewAnimLeft = activeItemNewAnim.position();

    $(".hori-selector").css({
      "top": itemPosNewAnimTop?.top + "px",
      "left": itemPosNewAnimLeft?.left + "px",
      "height": activeWidthNewAnimHeight + "px",
      "width": activeWidthNewAnimWidth + "px"
    });

    $("#navbarSupportedContent").on("click", "li", (e: JQuery.ClickEvent) => {
      $('#navbarSupportedContent ul li').removeClass("active");
      $(e.currentTarget).addClass('active');

      const activeWidthNewAnimHeight = $(e.currentTarget).innerHeight();
      const activeWidthNewAnimWidth = $(e.currentTarget).innerWidth();
      const itemPosNewAnimTop = $(e.currentTarget).position();
      const itemPosNewAnimLeft = $(e.currentTarget).position();

      $(".hori-selector").css({
        "top": itemPosNewAnimTop?.top + "px",
        "left": itemPosNewAnimLeft?.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
      });
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    setTimeout(() => this.test(), 500);
  }

  toggleNavbar(): void {
    $(".navbar-collapse").slideToggle(300);
    setTimeout(() => this.test());
  }

  setActiveClassOnPageLoad(): void {
    let path = window.location.pathname.split("/").pop();

    if (path === '') {
      path = 'index.html';
    }

    const target = $('#navbarSupportedContent ul li a[href="' + path + '"]');
    target.parent().addClass('active');
  }

  activeTab: string = 'deboarding';

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}


