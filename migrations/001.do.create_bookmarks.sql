CREATE TABLE items (
      id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    url TEXT NOT NULL, 
    title TEXT NOT NULL, 
    rating INTEGER NOT NULL, 
    description TEXT 
);