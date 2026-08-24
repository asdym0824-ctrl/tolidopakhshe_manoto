import { Product } from '../types';

/**
 * Calculates total unit stock by combining pack stock multiplied by pack size,
 * plus any loose single units.
 * 
 * Formula: (packStock * packSize) + singleStock
 */
export function calculateTotalUnitStock(
  packStock: number,
  packSize: number,
  singleStock: number = 0
): number {
  const validPackStock = Math.max(0, Number(packStock) || 0);
  const validPackSize = Math.max(1, Number(packSize) || 1);
  const validSingleStock = Math.max(0, Number(singleStock) || 0);
  return validPackStock * validPackSize + validSingleStock;
}

/**
 * Helper to get total units directly from a product object
 */
export function getProductTotalUnits(
  product: Pick<Product, 'packStock' | 'packSize'> & { singleStock?: number }
): number {
  return calculateTotalUnitStock(
    product.packStock,
    product.packSize,
    product.singleStock || 0
  );
}
