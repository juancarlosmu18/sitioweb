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
  // Etiqueta visible según el tipo de precio. «custom» y «from» no son precios
  // cerrados: los encargos se cotizan según diseño y complejidad.
  const labels = {
    from: 'Desde ',
    variable: 'Precio variable: ',
    quote: 'Cotizar ',
    custom: 'Referencia: '
  };
  const amount = Number(pricing.amount);
  const formattedAmount = Number.isFinite(amount) && amount > 0
    ? `$${amount.toLocaleString('es-CO')}`
    : '';
  return `${labels[pricing.type] || ''}${formattedAmount}`.trim() || 'Consultar precio';
}

export function mergeProducts(publishedProducts, localProducts) {
  return [...new Map([...publishedProducts, ...localProducts].map(product => [product.id, product])).values()];
}
