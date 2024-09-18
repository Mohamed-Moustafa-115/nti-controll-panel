import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  subscription: any;
  id: string = '';
  imgDomain: string = '';
  product: any = {};
  reviewError: string = '';
  reviewForm = new FormGroup({
    comment: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    rating: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)])
  })
  constructor(private _ActivatedRoute: ActivatedRoute,
    private _ProductsService: ProductsService) { }

  loadProduct() {
    this.subscription = this._ProductsService.getProduct(this.id).subscribe((res) => {
      this.product = res.data
    })
  }



  ngOnInit(): void {
    this.id = this._ActivatedRoute.snapshot.params['id']
    this.imgDomain = this._ProductsService.productsImages;
    this.loadProduct()
  }

  ngOnDestroy(): void { this.subscription.unsubscribe(); }
}
