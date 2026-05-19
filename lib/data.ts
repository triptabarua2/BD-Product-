import { Product, ProductPrice } from './types';
export const categories = ['Mobile Phones','Laptops','Tablets','Headphones','Cameras','Smart Watches','Home Appliances','Kitchen Appliances','Beauty Products','Health Products','Baby Products','Fashion','Shoes','Gaming Accessories','Computer Components'];
export const products: Product[] = [
  { id:'1', slug:'samsung-galaxy-a55', name:'Samsung Galaxy A55', brand:'Samsung', category:'Mobile Phones', heroImage:'https://images.unsplash.com/photo-1598327105666-5b89351aff97', rating:4.5, popularity:95, specs:{Display:'6.6" AMOLED',RAM:'8GB',Storage:'256GB',Battery:'5000mAh'} },
  { id:'2', slug:'xiaomi-redmi-note-13-pro', name:'Xiaomi Redmi Note 13 Pro', brand:'Xiaomi', category:'Mobile Phones', heroImage:'https://images.unsplash.com/photo-1585060544812-6b45742d762f', rating:4.4, popularity:92, specs:{Display:'6.67" OLED',RAM:'12GB',Storage:'256GB',Battery:'5100mAh'} },
  { id:'3', slug:'asus-vivobook-15', name:'Asus Vivobook 15', brand:'Asus', category:'Laptops', heroImage:'https://images.unsplash.com/photo-1593642632823-8f785ba67e45', rating:4.3, popularity:83, specs:{CPU:'Intel Core i5',RAM:'16GB',Storage:'512GB SSD',Display:'15.6" FHD'} }
];
export const prices: ProductPrice[] = [
  { productId:'1', storeName:'Daraz Bangladesh', storeUrl:'#', affiliateUrl:'#', currentPrice:54999, originalPrice:59999, discountPercent:8.3, availability:'in_stock', lastUpdated:new Date().toISOString() },
  { productId:'1', storeName:'Star Tech', storeUrl:'#', affiliateUrl:'#', currentPrice:55990, originalPrice:59999, discountPercent:6.7, availability:'in_stock', lastUpdated:new Date().toISOString() },
  { productId:'2', storeName:'Pickaboo', storeUrl:'#', affiliateUrl:'#', currentPrice:38999, originalPrice:42999, discountPercent:9.3, availability:'in_stock', lastUpdated:new Date().toISOString() },
  { productId:'3', storeName:'Ryans Computers', storeUrl:'#', affiliateUrl:'#', currentPrice:78999, originalPrice:85999, discountPercent:8.1, availability:'in_stock', lastUpdated:new Date().toISOString() }
];
export const formatBDT = (n:number)=> new Intl.NumberFormat('bn-BD',{style:'currency',currency:'BDT',maximumFractionDigits:0}).format(n);
