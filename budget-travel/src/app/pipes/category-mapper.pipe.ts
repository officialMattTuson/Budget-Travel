import { Pipe, PipeTransform } from '@angular/core';
import { CategoriesService } from '../services/categories.service';

@Pipe({
  name: 'categoryMap',
})
export class CategoryMapperPipe implements PipeTransform {
  constructor(private readonly categoriesService: CategoriesService) {}

  transform(id: number): any {
    const categories = this.categoriesService.getStoredCategories();

    const foundItem = categories.find((category) => category['id'] === id);
    return foundItem ? foundItem['name'] : null;
  }
}
