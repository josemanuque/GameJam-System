import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule
  ],
  templateUrl: './table-skeleton.component.html',
  styleUrl: './table-skeleton.component.scss'
})
export class TableSkeletonComponent {
  
}
