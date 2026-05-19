insert into categories(name,slug) values
('Mobile Phones','mobile-phones'),('Laptops','laptops'),('Home Appliances','home-appliances') on conflict do nothing;
insert into brands(name,slug) values
('Samsung','samsung'),('Xiaomi','xiaomi'),('Walton','walton'),('Singer','singer'),('Vision','vision'),('Asus','asus') on conflict do nothing;
