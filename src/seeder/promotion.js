const currentDate = new Date();
const endDate = new Date(currentDate);
endDate.setMonth(endDate.getMonth() + 3);

const promotions = [
    {
        name: "Mua 1 tặng 1 Pizza",
        description: "Mua 1 pizza + 2 uống nhỏ tặng 1 pizza cùng size",
        type: "GIFT_PRODUCT",
        startDate: currentDate,
        endDate: endDate,
        active: true,
        conditions: {
            requiredProducts: [
                {
                    productId: null, // Will be linked to any pizza
                    quantity: 1,
                },
                {
                    productId: null, // Will be linked to drinks
                    quantity: 2,
                    size: "small"
                }
            ],
            minQuantity: 3
        },
        benefits: {
            giftProducts: [{
                productId: null, // Will be linked to same pizza
                quantity: 1,
                size: "medium" // Changed from "same" to a valid enum value
            }]
        }
    },
    {
        name: "Combo ưu đãi đặc biệt",
        description: "Mua 1 pizza + 1 uống tặng 1 gà/mỳ ý + 1 tráng miệng + 1 coca-cola zero sugar",
        type: "GIFT_PRODUCT",
        startDate: currentDate,
        endDate: endDate,
        active: true,
        conditions: {
            requiredProducts: [
                {
                    productId: null, // Will be linked to any pizza
                    quantity: 1
                },
                {
                    productId: null, // Will be linked to drinks
                    quantity: 1
                }
            ],
            minQuantity: 2
        },
        benefits: {
            giftProducts: [
                {
                    productId: null, // Will be linked to chicken/pasta
                    quantity: 1
                },
                {
                    productId: null, // Will be linked to dessert
                    quantity: 1
                },
                {
                    productId: null, // Will be linked to Coca-Cola Zero
                    quantity: 1
                }
            ]
        }
    },
    {
        name: "Giảm 70% pizza thứ 2",
        description: "Mua 1 pizza + 2 uống nhỏ mua pizza thứ 2 giảm 70%",
        type: "DISCOUNT_NEXT_PRODUCT",
        startDate: currentDate,
        endDate: endDate,
        active: true,
        conditions: {
            requiredProducts: [
                {
                    productId: null, // Will be linked to any pizza
                    quantity: 1
                },
                {
                    productId: null, // Will be linked to drinks
                    quantity: 2,
                    size: "small"
                }
            ],
            minQuantity: 3
        },
        benefits: {
            discountPercentage: 70
        }
    },
    {
        name: "Đồng giá Pizza đặc biệt",
        description: "Mua 2 pizza trở lên - đồng giá hấp dẫn",
        type: "FIXED_PRICE",
        startDate: currentDate,
        endDate: endDate,
        active: true,
        conditions: {
            minQuantity: 2,
            specificProducts: [] // Will be linked to specific pizzas A, B, C
        },
        benefits: {
            fixedPrice: {
                price: 99000,
                size: "medium"
            }
        }
    },
    {
        name: "Ưu đãi món chay",
        description: "Giảm 50% cho món chay vào mồng 1 và 15 hàng tháng",
        type: "DATE_BASED_DISCOUNT",
        startDate: currentDate,
        endDate: endDate,
        active: true,
        conditions: {
            minQuantity: 2,
            specificDates: [1, 15],
            specificCategories: ["vegetarian"]
        },
        benefits: {
            discountPercentage: 50
        }
    },
    {
        name: "Combo tiết kiệm 1",
        description: "1 pizza M + 1 phần gà viên + 3 đồ uống nhỏ",
        type: "COMBO",
        startDate: currentDate,
        endDate: endDate,
        active: true,
        conditions: {
            requiredProducts: [
                {
                    productId: null, // Will be linked to any pizza
                    quantity: 1,
                    size: "medium"
                },
                {
                    productId: null, // Will be linked to chicken
                    quantity: 1
                },
                {
                    productId: null, // Will be linked to drinks
                    quantity: 3,
                    size: "small"
                }
            ]
        },
        benefits: {
            comboPrice: 279000
        }
    },
    {
        name: "Combo tiết kiệm 2",
        description: "1 pizza M + 1 phần khai vị + 1 chocochips + 3 đồ uống nhỏ",
        type: "COMBO",
        startDate: currentDate,
        endDate: endDate,
        active: true,
        conditions: {
            requiredProducts: [
                {
                    productId: null, // Will be linked to any pizza
                    quantity: 1,
                    size: "medium"
                },
                {
                    productId: null, // Will be linked to appetizer
                    quantity: 1
                },
                {
                    productId: null, // Will be linked to chocochips
                    quantity: 1
                },
                {
                    productId: null, // Will be linked to drinks
                    quantity: 3,
                    size: "small"
                }
            ]
        },
        benefits: {
            comboPrice: 309000
        }
    },
    {
        name: "Combo tiết kiệm 3",
        description: "2 pizza M + 1 phần gà viên + 1 bánh cuộn + 1 đồ uống lớn",
        type: "COMBO",
        startDate: currentDate,
        endDate: endDate,
        active: true,
        conditions: {
            requiredProducts: [
                {
                    productId: null, // Will be linked to any pizza
                    quantity: 2,
                    size: "medium"
                },
                {
                    productId: null, // Will be linked to chicken
                    quantity: 1
                },
                {
                    productId: null, // Will be linked to roll
                    quantity: 1
                },
                {
                    productId: null, // Will be linked to drinks
                    quantity: 1,
                    size: "large"
                }
            ]
        },
        benefits: {
            comboPrice: 399000
        }
    }
];

module.exports = { promotions };
