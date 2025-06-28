export interface Category {
  id: number;
  name: string;
  color?: string;
}

export interface CategoryBudget {
  categoryId: number;
  amount: number;
}

export class CategoryColor {
  public static readonly palette = ['#42a2da', '#fbbc05', '#34a853', '#ea4335', '#ab47bc'];
  static getColorById(id: number): string {
    return CategoryColor.palette[id % CategoryColor.palette.length];
  }
}
