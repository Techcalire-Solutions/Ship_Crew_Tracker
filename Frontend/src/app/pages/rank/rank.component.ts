import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Rank } from '../../common/interfaces/rank';
import { EmployeeService } from '../../services/employee.service';
import { DeleteDialogueComponent } from '../../theme/components/delete-dialogue/delete-dialogue.component';
import { AddRankComponent } from './add-rank/add-rank.component';

@Component({
  selector: 'app-rank',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './rank.component.html',
  styleUrl: './rank.component.scss'
})
export class RankComponent {
  image = 'img/addrank.png'
  ngOnDestroy(): void {
    this.rankSub?.unsubscribe();
    this.delete?.unsubscribe();
  }

  constructor(private employeeService: EmployeeService, private dialog: MatDialog, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.getRank()
  }

  rankSub!: Subscription;
  ranks: Rank[] = [];
  getRank(){
    this.rankSub = this.employeeService.getRank(this.searchText, this.currentPage, this.pageSize).subscribe((rank: any) =>{
      this.ranks = rank.items
    })
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  public onPageChanged(event: any){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getRank()
  }

  public searchText!: string;
  search(event: Event){
    this.searchText = (event.target as HTMLInputElement).value.trim()
    this.getRank()
  }

  addRank(rank: Rank | null){
    let dialogRef = this.dialog.open(AddRankComponent, {
      data: rank
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getRank();
    });
  }

  delete!: Subscription;
  deleteRank(id: string){
    let dialogRef = this.dialog.open(DeleteDialogueComponent, {});
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.delete = this.employeeService.deleteRank(id).subscribe(res => {
          this.snackBar.open("Rank deleted successfully...","" ,{duration:3000})
          this.getRank()
        });
      }
    });
  }
}
