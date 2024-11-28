export const reviewTypes = [
    { label: "Code Quality", value: "quality" },
    { label: "Security Audit", value: "security" },
    { label: "Performance Review", value: "performance" },
    { label: "Feature Implementation", value: "feature" },
];

export const visibility = [
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
]

export const priorities = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
]

export const getReviewTypeByKey = (key: string) => {
    return reviewTypes.find((type) => type.value === key)
}