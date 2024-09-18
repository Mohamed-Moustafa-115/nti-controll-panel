import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SubcategoriesService } from '../services/subcategories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit,OnDestroy{
  id: string = '';
  categoriesSubscription: any;
  subcategoriesSubscription: any;
  categories: any[] = [];
  subcategories: any[] = [];
  getName: string = '';
  getDescription: string = '';
  getPrice: string = '0';
  getQuantity: string = '0';
  getCategory: string = '';
  getSubcategory: string = '';
  productCover: any;
  productImages: any[] = [];
  setCover(event: any) {
    const cover = event.target.files[0]
    if (cover) { this.productCover = cover };
  }
  setImages(event: any) {
    const images = event.target.files;
    if (images) { this.productImages = images };
  }
  constructor(private _AuthService: AuthService, private _ProductsService: ProductsService, private _CategoriesService: CategoriesService,
    private _SubcategoriesService: SubcategoriesService, private _Router: Router ,private _ActivatedRoute: ActivatedRoute
  ) { }

  loadCategories() {
    this.categoriesSubscription = this._CategoriesService.getCategories(200, 1, 'name', '').subscribe({
      next: (res) => {
        this.categories = res.data;
      }, error: (err) => { }
    })
  }

  loadSubcategories(categoryId: string) {
    this.getCategory = categoryId;
    this.subcategoriesSubscription = this._SubcategoriesService.getSpecificSubcategories(categoryId, 200, 'name').subscribe({
      next: (res) => {
        this.subcategories = res.data;
      }
    })
  }

  updateProd() {
    const formData = new FormData();
    if (this.getDescription) {
      formData.append('description', this.getDescription);
    };

    if (this.getCategory) {
      formData.append('category', this.getCategory);
    };

    if (this.getSubcategory) {
      formData.append('subcategory', this.getSubcategory);
    };

    if (this.getPrice!=='0') {
      formData.append('price', this.getPrice);
    };

    if (this.getQuantity!=='0') {
      formData.append('quantity', this.getQuantity);
    };

    if (this.getName) {
      formData.append('name', this.getName);
    };

    if (this.productCover) {
      formData.append('cover', this.productCover);
    };

    if (this.productImages && this.productImages.length > 0) {
      for (let i = 0; i < this.productImages.length; i++) {
        formData.append('images', this.productImages[i]);
      }
    }

    var obj: { [key: string]: any } = {};
  formData.forEach((value, key) => {
    if (obj[key]) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  });

    this._ProductsService.updateProduct(this.id, obj).subscribe({
      next: (res) => {
        alert('product updated successfully');
        this._Router.navigate(['/products']);
      }
    })
  }

  ngOnInit(): void {
    this._AuthService.checkToken()
    this.id = this._ActivatedRoute.snapshot.params['id']
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
    if (this.subcategoriesSubscription) {
      this.subcategoriesSubscription.unsubscribe();
    }
  }
}
