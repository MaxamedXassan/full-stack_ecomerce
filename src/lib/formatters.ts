const CURREMCY_FORMATTER = new Intl.NumberFormat("en-us", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 0,
})

export function formatCurency(amount: Number) {
    return CURREMCY_FORMATTER.format(amount)
}

const NumberFormat = new Intl.NumberFormat("en-US")

export function formatNumber(number: Number) {
    return NumberFormat.format(number)
}