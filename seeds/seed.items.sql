BEGIN; 

INSERT INTO items(url, title, rating, content)
values
('www.myspace.com', 'amazon', 3, 'test'), 
('www.thinkful.com', 'thinkful', 4, 'bootcamp'), 
('www.hotmail.com', 'email', 4, 'test'), 
('www.facebook.com', 'email2', 3, 'test'), 
('www.ebay.com', 'ebay', 3, 'online shopping');

COMMIT;