export const formatCurrency = (value: number): string => 
  value.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  })

export const formatNumber = (value: number): string => 
  value.toLocaleString('en-US', { 
    maximumFractionDigits: 0 
  })
