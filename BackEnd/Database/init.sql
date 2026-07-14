/* ============================================================
   ECommerceDB - full database script
   Creates the database, 5 tables (Users, Products, Cart,
   Orders, OrderItems) with PKs, FKs and sample records.
   The script is idempotent: it can be executed many times.
   ============================================================ */

-- 1) Create the database itself (only if it does not exist yet)
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = 'ECommerceDB')
BEGIN
    CREATE DATABASE ECommerceDB;
END
GO

USE ECommerceDB;
GO

/* ------------------------------------------------------------
   Table 1: Users  (customers and admins)
   ------------------------------------------------------------ */
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserID        INT            IDENTITY(1,1) PRIMARY KEY,
        FullName      NVARCHAR(100)  NOT NULL,
        Email         NVARCHAR(150)  NOT NULL UNIQUE,
        PasswordHash  NVARCHAR(255)  NOT NULL,
        Role          NVARCHAR(20)   NOT NULL DEFAULT 'Customer'
                       CHECK (Role IN ('Admin', 'Customer')),
        CreatedAt     DATETIME       NOT NULL DEFAULT GETDATE()
    );
END
GO

/* ------------------------------------------------------------
   Table 2: Products  (the shop catalogue)
   ------------------------------------------------------------ */
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE Products (
        ProductID     INT            IDENTITY(1,1) PRIMARY KEY,
        Name          NVARCHAR(150)  NOT NULL,
        Description   NVARCHAR(500)  NULL,
        Price         DECIMAL(10,2)  NOT NULL CHECK (Price > 0),
        StockQuantity INT            NOT NULL DEFAULT 0 CHECK (StockQuantity >= 0),
        Category      NVARCHAR(50)   NULL,
        ImageURL      NVARCHAR(500)  NULL,
        CreatedAt     DATETIME       NOT NULL DEFAULT GETDATE()
    );
END
GO

/* ------------------------------------------------------------
   Table 3: Cart  (shopping cart lines, one row per user+product)
   FK to Users and Products. No cascade: the API removes cart
   rows itself before deleting a user or a product.
   ------------------------------------------------------------ */
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Cart')
BEGIN
    CREATE TABLE Cart (
        CartID    INT      IDENTITY(1,1) PRIMARY KEY,
        UserID    INT      NOT NULL,
        ProductID INT      NOT NULL,
        Quantity  INT      NOT NULL DEFAULT 1 CHECK (Quantity > 0),
        AddedAt   DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_Cart_Users    FOREIGN KEY (UserID)    REFERENCES Users(UserID),
        CONSTRAINT FK_Cart_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
        CONSTRAINT UQ_Cart_UserProduct UNIQUE (UserID, ProductID)
    );
END
GO

/* ------------------------------------------------------------
   Table 4: Orders  (one row per placed order)
   FK to Users without cascade: a user that still has orders
   cannot be deleted (the API turns that into a friendly error).
   ------------------------------------------------------------ */
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Orders')
BEGIN
    CREATE TABLE Orders (
        OrderID     INT           IDENTITY(1,1) PRIMARY KEY,
        UserID      INT           NOT NULL,
        OrderDate   DATETIME      NOT NULL DEFAULT GETDATE(),
        TotalAmount DECIMAL(12,2) NOT NULL DEFAULT 0,
        Status      NVARCHAR(20)  NOT NULL DEFAULT 'Pending'
                     CHECK (Status IN ('Pending', 'Completed', 'Cancelled')),

        CONSTRAINT FK_Orders_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
    );
END
GO

/* ------------------------------------------------------------
   Table 5: OrderItems  (the products inside each order)
   ON DELETE CASCADE from Orders: deleting an order also
   deletes its items. FK to Products without cascade: a product
   used in an old order cannot be deleted.
   ------------------------------------------------------------ */
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'OrderItems')
BEGIN
    CREATE TABLE OrderItems (
        OrderItemID INT           IDENTITY(1,1) PRIMARY KEY,
        OrderID     INT           NOT NULL,
        ProductID   INT           NOT NULL,
        Quantity    INT           NOT NULL CHECK (Quantity > 0),
        UnitPrice   DECIMAL(10,2) NOT NULL CHECK (UnitPrice >= 0),

        CONSTRAINT FK_OrderItems_Orders   FOREIGN KEY (OrderID)
                   REFERENCES Orders(OrderID) ON DELETE CASCADE,
        CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductID)
                   REFERENCES Products(ProductID)
    );
END
GO

/* ============================================================
   Sample records (inserted only when the tables are empty)
   ============================================================ */

-- Users: 1 admin + 3 customers.
-- The API compares the password as plain text, so the demo
-- password for every account is simply: 123456
IF NOT EXISTS (SELECT 1 FROM Users)
BEGIN
    INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES
    (N'Admin User',      N'admin@shop.com',  N'123456', 'Admin'),
    (N'Ayaan Mohamed',   N'ayaan@gmail.com', N'123456', 'Customer'),
    (N'Hodan Ali',       N'hodan@gmail.com', N'123456', 'Customer'),
    (N'Mohamed Farah',   N'mfarah@gmail.com',N'123456', 'Customer');
END
GO

IF NOT EXISTS (SELECT 1 FROM Products)
BEGIN
    INSERT INTO Products (Name, Description, Price, StockQuantity, Category, ImageURL) VALUES
    (N'Wireless Headphones', N'Over-ear Bluetooth headphones with noise cancelling.', 89.99, 40, N'Electronics', N'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
    (N'Smart Watch',         N'Fitness tracking smart watch with heart-rate sensor.', 129.50, 25, N'Electronics', N'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'),
    (N'Laptop Backpack',     N'Water-resistant backpack with 15.6" laptop pocket.',   45.00, 60, N'Accessories', N'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'),
    (N'Running Shoes',       N'Lightweight running shoes with breathable mesh.',      74.90, 35, N'Shoes',       N'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'),
    (N'Cotton T-Shirt',      N'Classic-fit 100% cotton t-shirt.',                     14.99, 120, N'Clothing',   N'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'),
    (N'Coffee Maker',        N'12-cup programmable drip coffee maker.',               59.99, 18, N'Home',        N'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'),
    (N'Mechanical Keyboard', N'RGB mechanical keyboard with blue switches.',          99.00, 22, N'Electronics', N'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500'),
    (N'Sunglasses',          N'Polarized UV400 sunglasses.',                          29.95, 80, N'Accessories', N'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500');
END
GO

-- Cart: Ayaan (UserID 2) has 2 items waiting in her cart
IF NOT EXISTS (SELECT 1 FROM Cart)
BEGIN
    INSERT INTO Cart (UserID, ProductID, Quantity) VALUES
    (2, 1, 1),
    (2, 5, 3);
END
GO

-- Orders + OrderItems: two finished orders with matching totals
IF NOT EXISTS (SELECT 1 FROM Orders)
BEGIN
    -- Order 1: Hodan bought a Smart Watch and 2 T-Shirts
    INSERT INTO Orders (UserID, TotalAmount, Status)
    VALUES (3, 129.50 + (2 * 14.99), 'Completed');

    DECLARE @Order1 INT = SCOPE_IDENTITY();

    INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice) VALUES
    (@Order1, 2, 1, 129.50),
    (@Order1, 5, 2, 14.99);

    -- Order 2: Mohamed bought Running Shoes, still pending
    INSERT INTO Orders (UserID, TotalAmount, Status)
    VALUES (4, 74.90, 'Pending');

    DECLARE @Order2 INT = SCOPE_IDENTITY();

    INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice) VALUES
    (@Order2, 4, 1, 74.90);
END
GO

PRINT 'ECommerceDB is ready: 5 tables created and sample data inserted.';
GO
