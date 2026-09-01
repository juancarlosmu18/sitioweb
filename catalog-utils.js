export function getPricing(product) {
  return product.pricing || {
    type: product.priceFrom != null && (product.price == null || product.priceFrom !== product.price)
      ? 'from'
      : 'fixed',
    amount: product.priceFrom ?? product.price ?? 0,
    currency: 'COP'
  };
}

export function formatPrice(pricing) {
  const labels = { from: 'Desde ', variable: 'Precio variable', quote: 'Cotizar' };
  const amount = Number(pricing.amount);
  const formattedAmount = Number.isFinite(amount) && amount > 0
    ? `$${amount.toLocaleString('es-CO')}`
    : '';
  return `${labels[pricing.type] || ''}${formattedAmount}`.trim() || 'Consultar precio';
}
