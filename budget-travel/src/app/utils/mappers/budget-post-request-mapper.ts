import { BudgetPostRequest, Budget } from '../../models/budgets.model';

export function mapBudgetToPostRequest(
  budgetData: BudgetPostRequest
): Partial<Budget> {
  let budgetPostObject: Partial<Budget> = {
    name: budgetData.budgetName,
    amount: budgetData.budgetTarget,
    currency: budgetData.budgetCurrency,
    startDate: budgetData.budgetStartDate.toLocaleDateString(),
    endDate: budgetData.budgetEndDate.toLocaleDateString(),
  };
  return budgetPostObject;
}
