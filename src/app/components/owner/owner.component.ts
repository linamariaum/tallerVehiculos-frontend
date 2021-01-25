import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Owner } from 'src/app/models/Owner';
import { OwnerService } from 'src/app/services/owner.service';
import Swal from 'sweetalert2';

export class VehicleOwnerDetails {
  id: number;
  plate: string;
  brand: string;
  model: string;
  color: string;
  vehicleType: {
    id: number,
    name: string
  };
  state: {
    id: number,
    name: string,
    description: string
  };
}

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  token: string;
  idOwner: string;
  owner: Owner;
  vehicles: VehicleOwnerDetails[];

  dataSource: MatTableDataSource<VehicleOwnerDetails>;
  columnsToDisplay: string[] = ['vehicleType.name', 'plate', 'brand', 'model', 'color', 'state.name'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  spinner: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private ownerService: OwnerService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length === 2 && Object.keys(params)[0] === 'id' && Object.keys(params)[1] === 'token') {
        this.idOwner = params.id;
        this.token = params.token;
        //this.loadOwner();
        this.spinner = true;
        this.loadOwnerInfo();
      } else {
        this.router.navigate(['/homepage']);
        return;
      }
    });
  }

  async loadOwner() {
    return this.ownerService.getOwner(+this.idOwner).then(
      (result) => {
        const data = JSON.parse(result);
        if (data) {
          this.owner = data;
          console.log(this.owner)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se encontró el usuario!',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7',
          })
          this.router.navigate(['/homepage']);
        }
      }, (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ha ocurrido un problema en el servidor!',
          showConfirmButton: true,
          confirmButtonColor: '#34c4b7',
        })
        this.router.navigate(['/homepage']);
      }
    );
  }

  loadOwnerInfo() {
    return this.ownerService.getOwnerShowDetails(this.idOwner, this.token).then(
      (data) => {
        if (data) {
          this.owner = {
            id: data.ownerInfo.id,
            name: data.ownerInfo.name,
            email: data.ownerInfo.email,
            cellphone: data.ownerInfo.cellphone
          }
          this.vehicles = data.vehicles;
          this.spinner = false;
          this.dataSource = new MatTableDataSource(this.vehicles);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se encontró el usuario!',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7',
          })
          this.router.navigate(['/homepage']);
        }
        this.spinner = false;
      }, (error) => {
        console.error(error);
        this.spinner = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ha ocurrido un problema en el servidor!',
          showConfirmButton: true,
          confirmButtonColor: '#34c4b7',
        })
        this.router.navigate(['/homepage']);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
