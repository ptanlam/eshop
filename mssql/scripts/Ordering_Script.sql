USE [master]
GO
/****** Object:  Database [Ordering_Service_Db]    Script Date: 12/8/2021 11:07:11 PM ******/
CREATE DATABASE [Ordering_Service_Db]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Ordering_Service_Db', FILENAME = N'/var/opt/mssql/data/Ordering_Service_Db.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Ordering_Service_Db_log', FILENAME = N'/var/opt/mssql/data/Ordering_Service_Db_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [Ordering_Service_Db] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Ordering_Service_Db].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Ordering_Service_Db] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET ARITHABORT OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Ordering_Service_Db] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Ordering_Service_Db] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET  ENABLE_BROKER 
GO
ALTER DATABASE [Ordering_Service_Db] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Ordering_Service_Db] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET RECOVERY FULL 
GO
ALTER DATABASE [Ordering_Service_Db] SET  MULTI_USER 
GO
ALTER DATABASE [Ordering_Service_Db] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Ordering_Service_Db] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Ordering_Service_Db] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Ordering_Service_Db] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Ordering_Service_Db] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Ordering_Service_Db] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'Ordering_Service_Db', N'ON'
GO
ALTER DATABASE [Ordering_Service_Db] SET QUERY_STORE = OFF
GO
USE [Ordering_Service_Db]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers](
	[Id] [uniqueidentifier] NOT NULL,
	[Fullname] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](15) NULL,
	[Email] [nvarchar](320) NULL,
 CONSTRAINT [PK_Customers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Items]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Items](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [uniqueidentifier] NOT NULL,
	[Price] [decimal](10, 2) NULL,
	[PriceUnit] [nvarchar](3) NULL,
	[Quantity] [int] NOT NULL,
	[OrderId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_Items] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Journeys]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Journeys](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Location] [nvarchar](max) NULL,
	[TimeStamp] [datetime2](7) NOT NULL,
	[Notes] [nvarchar](max) NULL,
	[OrderId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_Journeys] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[Id] [uniqueidentifier] NOT NULL,
	[Notes] [nvarchar](max) NULL,
	[Status] [int] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NULL,
	[DeletedAt] [datetime2](7) NULL,
	[VendorId] [uniqueidentifier] NOT NULL,
	[ShippingAddressId] [int] NOT NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
	[ReceiptId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Orders] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ShippingAddresses]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ShippingAddresses](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Country] [nvarchar](max) NULL,
	[City] [nvarchar](max) NULL,
	[District] [nvarchar](max) NULL,
	[Ward] [nvarchar](max) NULL,
	[Street] [nvarchar](max) NULL,
	[Details] [nvarchar](max) NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_ShippingAddresses] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Customers_Email_PhoneNumber]    Script Date: 12/8/2021 11:07:11 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Customers_Email_PhoneNumber] ON [dbo].[Customers]
(
	[Email] ASC,
	[PhoneNumber] ASC
)
WHERE ([Email] IS NOT NULL AND [PhoneNumber] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Items_OrderId]    Script Date: 12/8/2021 11:07:11 PM ******/
CREATE NONCLUSTERED INDEX [IX_Items_OrderId] ON [dbo].[Items]
(
	[OrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Journeys_OrderId]    Script Date: 12/8/2021 11:07:11 PM ******/
CREATE NONCLUSTERED INDEX [IX_Journeys_OrderId] ON [dbo].[Journeys]
(
	[OrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Items]  WITH CHECK ADD  CONSTRAINT [FK_Items_Orders_OrderId] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[Items] CHECK CONSTRAINT [FK_Items_Orders_OrderId]
GO
ALTER TABLE [dbo].[Journeys]  WITH CHECK ADD  CONSTRAINT [FK_Journeys_Orders_OrderId] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[Journeys] CHECK CONSTRAINT [FK_Journeys_Orders_OrderId]
GO
/****** Object:  StoredProcedure [dbo].[uspGetAllOrders]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[uspGetAllOrders]
    @email NVARCHAR(320) = NULL,
    @vendorId UNIQUEIDENTIFIER = NULL
AS
BEGIN
    SELECT 
        o.*
    FROM 
        Orders o
        JOIN 
            (SELECT * 
            FROM Customers 
            WHERE 
                (@email IS NULL) OR (Email = @email)) c
            ON c.Id = o.CustomerId
    WHERE
        (@vendorId IS NULL) OR (o.VendorId = @vendorId)
    ORDER BY 
        o.CreatedAt
END
GO
/****** Object:  StoredProcedure [dbo].[uspGetCustomerByEmailAndPhoneNumber]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[uspGetCustomerByEmailAndPhoneNumber]
    @email NVARCHAR(320),
    @phoneNumber NVARCHAR(15)
AS
BEGIN
    SELECT 
        c.*
    FROM
        Customers c
    WHERE 
        Email = @email
        AND PhoneNumber = @phoneNumber
END
GO
/****** Object:  StoredProcedure [dbo].[uspGetItemsForOrder]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[uspGetItemsForOrder]
    @orderId UNIQUEIDENTIFIER
AS
BEGIN
   SELECT *
   FROM Items
   WHERE OrderId = @orderId
END
GO
/****** Object:  StoredProcedure [dbo].[uspGetNumberOfOrdersForTarget]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[uspGetNumberOfOrdersForTarget]
    @email NVARCHAR(320) = NULL,
    @vendorId UNIQUEIDENTIFIER = NULL
AS
BEGIN
    SELECT 
        COUNT(*)
    FROM 
        Orders o
        JOIN 
            (SELECT * 
            FROM Customers 
            WHERE 
                (@email IS NULL) OR (Email = @email)) c
            ON c.Id = o.CustomerId
    WHERE
        (@vendorId IS NULL) OR (o.VendorId = @vendorId)
END
GO
/****** Object:  StoredProcedure [dbo].[uspGetOrderById]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[uspGetOrderById]
    @id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT 
        o.*, 
        i.OrderId, 
        i.Price, 
        i.PriceUnit, 
        i.ProductId, 
        i.Quantity
    FROM
        Orders o
        JOIN 
            Items i ON i.OrderId = o.Id 
    WHERE o.Id = @id
END
GO
/****** Object:  StoredProcedure [dbo].[uspGetShippingAddress]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[uspGetShippingAddress]
    @customerId UNIQUEIDENTIFIER,
    @country NVARCHAR(250),
    @city NVARCHAR(250),
    @district NVARCHAR(250),
    @ward NVARCHAR(250),
    @street NVARCHAR(250),
    @details NVARCHAR(250)
AS
BEGIN
    DECLARE @ShippingAddress TABLE
    (
        Id INT,
        Country NVARCHAR(205),
        City NVARCHAR(205),
        District NVARCHAR(205),
        Ward NVARCHAR(205),
        Street NVARCHAR(205),
        Details NVARCHAR(205),
        CustomerId UNIQUEIDENTIFIER
    )
    INSERT INTO @ShippingAddress
    SELECT 
        sa.*
    FROM 
        ShippingAddresses sa
    WHERE 
        sa.Country = @country
        AND sa.City = @city
        AND sa.District = @district
        AND sa.Ward = @ward
        AND sa.Street = @street
        AND sa.Details = @details
        AND sa.CustomerId = @customerId

    DECLARE @Id INT = (SELECT Id FROM @ShippingAddress)

    IF(@Id IS NULL)
    BEGIN
        INSERT INTO ShippingAddresses
        (Country, City, District, Ward, Street, Details, CustomerId)
        OUTPUT inserted.*
        VALUES(@country, @city, @district, @ward, @street, @details, @customerId)
    END
    ELSE
    BEGIN
        SELECT * FROM @ShippingAddress
    END
END
GO
/****** Object:  StoredProcedure [dbo].[uspGetShippingAddressById]    Script Date: 12/8/2021 11:07:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[uspGetShippingAddressById]
    @id INT
AS
BEGIN
    SELECT *
    FROM
        ShippingAddresses sa
    WHERE 
        sa.Id = @id
END
GO
USE [master]
GO
ALTER DATABASE [Ordering_Service_Db] SET  READ_WRITE 
GO
