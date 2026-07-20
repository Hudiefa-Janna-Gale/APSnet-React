
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
   Seed: ONLY the admin account (no mock data).
   Password is 123456, stored as its SHA256 hash (Base64),
   matching PasswordHelper.Hash(). Products, customers, carts
   and orders are all created through the app itself.
   ============================================================ */
IF NOT EXISTS (SELECT 1 FROM Users WHERE Role = 'Admin')
BEGIN
    INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES
    (N'Admin User', N'admin@shop.com', N'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=', 'Admin');
END
GO

PRINT 'ECommerceDB is ready: 5 tables created, admin account seeded.';
GO
