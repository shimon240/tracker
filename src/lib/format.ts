import type { SalaryCurrency } from '@/types'

const CURRENCY_SYMBOLS: Record<SalaryCurrency, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
}

function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU')
}

export function formatSalary(
  min: number | null,
  max: number | null,
  currency: SalaryCurrency
): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency
  if (min && max) return `${formatNumber(min)} – ${formatNumber(max)} ${symbol}`
  if (min) return `от ${formatNumber(min)} ${symbol}`
  if (max) return `до ${formatNumber(max)} ${symbol}`
  return ''
}
