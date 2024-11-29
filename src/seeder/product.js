
const products = [
    {
      name: 'Pizza Siêu Topping Bơ Gơ Bò Mỹ Xốt Phô Mai',
      description: 'Thịt Bò Bơ Gơ Nhập Khẩu, Xốt Phô Mai, Phô Mai Mozzarella, Phô Mai Cheddar, Cà Chua, Hành Tây',
      price: { small: 119000, medium: 159000, large: 209000 },
      image: 'https://img.dominos.vn/cheeseburger-sup.jpg',
      mainCategories: ['pizza'],
      subCategory: ['beef']
    },
    {
      name: 'Pizza Siêu Topping Bơ Gơ Bò Mỹ Xốt Habanero',
      description: 'Thịt Bò Bơ Gơ, Thịt Heo Xông Khói, Xốt Habanero, Phô Mai, Dưa Chuột, Cà Chua',
      price: { small: 119000, medium: 169000, large: 219000 },
      image: 'https://img.dominos.vn/cheeseburger-habanero-sup.jpg',
      mainCategories: ['pizza'],
      subCategory: ['beef']
    },
    {
      name: 'Pizza Bò & Tôm Nướng Kiểu Mỹ',
      description: 'Tôm, Thịt Bò Mexico, Phô Mai Mozzarella, Cà Chua, Hành, Xốt Cà Chua',
      price: { small: 109000, medium: 159000, large: 209000 },
      image: 'https://img.dominos.vn/Surf-turf-Pizza-Bo-Tom-Nuong-Kieu-My-1.jpg',
      mainCategories: ['pizza'],
      subCategory: ['beef', 'seafood']
    },
    {
      name: 'Pizza Hải Sản Xốt Pesto Chanh Sả',
      description: 'Mực, Tôm, Phô Mai Mozzarella, Cà Chua, Hành Tây, Xốt Pesto, Xốt Chanh Sả',
      price: { small: 129000, medium: 189000, large: 239000 },
      image: 'https://img.dominos.vn/PC-MB1000X667px+super+topping%402x.png',
      mainCategories: ['pizza'],
      subCategory: ['seafood']
    },
    {
      name: 'Pizza Hải Sản Xốt Mayonnaise',
      description: 'Tôm, Mực, Thanh Cua, Phô Mai Mozzarella, Hành Tây, Xốt Mayonnaise',
      price: { small: 119000, medium: 179000, large: 229000 },
      image: 'https://img.dominos.vn/Pizza+Extra+Topping+(3).jpg',
      mainCategories: ['pizza'],
      subCategory: ['seafood']
    },
    {
      name: 'Pizza Gà Phô Mai Thịt Heo Xông Khói',
      description: 'Gà Viên, Thịt Heo Xông Khói, Phô Mai Mozzarella, Cà Chua, Xốt Phô Mai',
      price: { small: 99000, medium: 149000, large: 199000 },
      image: 'https://img.dominos.vn/Pizza-Ga-Pho-Mai-Thit-Heo-Xong-Khoi-Cheesy-Chicken-Bacon.jpg',
      mainCategories: ['pizza'],
      subCategory: ['chicken', 'pork']
    },
    {
      name: 'Pizza Gà Nướng Dứa',
      description: 'Gà Nướng, Dứa, Phô Mai Mozzarella, Xốt BBQ',
      price: { small: 89000, medium: 139000, large: 189000 },
      image: 'https://img.dominos.vn/Pizza-Dam-Bong-Dua-Kieu-Hawaii-Hawaiian.jpg',
      mainCategories: ['pizza'],
      subCategory: ['chicken']
    },
    {
      name: 'Pizza Thịt Xông Khói Dứa',
      description: 'Thịt Xông Khói, Dứa, Phô Mai Mozzarella, Xốt Cà Chua',
      price: { small: 99000, medium: 149000, large: 199000 },
      image: 'https://img.dominos.vn/Pizza+Extra+Topping+(1).jpg',
      mainCategories: ['pizza'],
      subCategory: ['pork']
    },
    {
      name: 'Pizza Thập Cẩm Thượng Hạng',
      description: 'Xúc Xích Pepperoni, Thịt Dăm Bông, Xúc Xich Ý, Thịt Bò Viên, Ớt Chuông, Nấm',
      price: { small: 109000, medium: 159000, large: 209000 },
      image: 'https://img.dominos.vn/Pizza-Thap-Cam-Thuong-Hang-Extravaganza.jpg',
      mainCategories: ['pizza'],
      subCategory: ['pork']
    },
    {
      name: 'Pizza Rau Củ Thập Cẩm',
      description: 'Hành Tây, Ớt Chuông Xanh, Ô-liu, Nấm, Cà Chua, Thơm (dứa)',
      price: { small: 89000, medium: 139000, large: 189000 },
      image: 'https://img.dominos.vn/Veggie-mania-Pizza-Rau-Cu-Thap-Cam.jpg',
      mainCategories: ['pizza'],
      subCategory: ['vegetarian']
    },
    {
      name: 'Pizza Phô Mai',
      description: 'Phô Mai Mozzarella, Xốt Cà Chua',
      price: { small: 79000, medium: 129000, large: 179000 },
      image: 'https://img.dominos.vn/Pizza-Pho-Mai-Hao-Hang-Cheese-Mania.jpg',
      mainCategories: ['pizza'],
      subCategory: ['vegetarian']
    },
    {
      name: 'Gà Rán Truyền Thống',
      description: 'Gà rán giòn tan, thơm ngon, đậm đà hương vị truyền thống.',
      price: { small: 59000, medium: 109000, large: 159000 },
      image: 'https://img.dominos.vn/375x200+G%C3%A0+Vi%C3%AAn+Ph%C3%B4+Mai+%C4%90%C3%BAt+L%C3%B2+new%402x.png',
      mainCategories: ['Chicken'],
      subCategory: []
    },
    {
      name: 'Gà Rán Cay',
      description: 'Gà rán giòn tan, cay nồng, thích hợp cho những ai yêu thích vị cay.',
      price: { small: 69000, medium: 119000, large: 169000 },
      image: 'https://img.dominos.vn/375x200+C%C3%A1nh+G%C3%A0+Ph%E1%BB%A7+X%E1%BB%91t+BBQ+HQ+new%402x.png',
      mainCategories: ['Chicken'],
      subCategory: []
    },
    {
      name: 'Gà Nướng BBQ',
      description: 'Gà nướng BBQ thơm lừng, đậm đà hương vị sốt BBQ đặc trưng.',
      price: { small: 79000, medium: 139000, large: 189000 },
      image: 'https://img.dominos.vn/375x200+C%C3%A1nh+G%C3%A0+Ph%E1%BB%A7+X%E1%BB%91t+BBQ+Ki%E1%BB%83u+M%E1%BB%B9+new%402x.png',
      mainCategories: ['Chicken'],
      subCategory: []
    }
];

module.exports = { products };