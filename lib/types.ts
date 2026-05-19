export type StoreName = 'Daraz Bangladesh'|'Pickaboo'|'Gadget & Gear'|'Ryans Computers'|'Star Tech'|'Walton'|'Singer Bangladesh'|'Transcom Digital'|'AjkerDeal';
export interface Product { id:string; slug:string; name:string; brand:string; category:string; heroImage:string; specs:Record<string,string>; rating:number; popularity:number; }
export interface ProductPrice { productId:string; storeName:StoreName; storeUrl:string; affiliateUrl:string; currentPrice:number; originalPrice:number; discountPercent:number; availability:'in_stock'|'out_of_stock'; lastUpdated:string; }
