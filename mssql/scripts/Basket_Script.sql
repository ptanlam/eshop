USE [master]
GO
/****** Object:  Database [Basket_Service_Db]    Script Date: 12/8/2021 11:01:48 PM ******/
CREATE DATABASE [Basket_Service_Db]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Basket_Service_Db', FILENAME = N'/var/opt/mssql/data/Basket_Service_Db.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Basket_Service_Db_log', FILENAME = N'/var/opt/mssql/data/Basket_Service_Db_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [Basket_Service_Db] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Basket_Service_Db].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Basket_Service_Db] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET ARITHABORT OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Basket_Service_Db] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Basket_Service_Db] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET  ENABLE_BROKER 
GO
ALTER DATABASE [Basket_Service_Db] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Basket_Service_Db] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET RECOVERY FULL 
GO
ALTER DATABASE [Basket_Service_Db] SET  MULTI_USER 
GO
ALTER DATABASE [Basket_Service_Db] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Basket_Service_Db] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Basket_Service_Db] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Basket_Service_Db] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Basket_Service_Db] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Basket_Service_Db] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'Basket_Service_Db', N'ON'
GO
ALTER DATABASE [Basket_Service_Db] SET QUERY_STORE = OFF
GO
USE [Basket_Service_Db]
GO
/****** Object:  Table [dbo].[Basket]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Basket](
	[id] [nvarchar](36) NOT NULL,
	[email] [nvarchar](255) NULL,
	[vendorId] [nvarchar](36) NULL,
	[vendorName] [nvarchar](50) NULL,
	[vendorLogoUrl] [nvarchar](max) NULL,
	[productId] [nvarchar](36) NULL,
	[name] [text] NOT NULL,
	[quantity] [int] NOT NULL,
	[price] [decimal](18, 2) NOT NULL,
	[description] [text] NOT NULL,
	[image] [nvarchar](max) NOT NULL,
	[unit] [nvarchar](3) NOT NULL,
	[slug] [nvarchar](250) NULL,
	[isActive] [bit] NOT NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Basket] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[Basket] ADD  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Basket] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Basket] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
/****** Object:  StoredProcedure [dbo].[SP_AddItemToBasket]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE       PROCEDURE [dbo].[SP_AddItemToBasket]
    @email NVARCHAR(255),
    @vendorId NVARCHAR(36),
    @vendorName NVARCHAR(50),
    @vendorLogoUrl NVARCHAR(MAX),
    @productId NVARCHAR(36),
    @name text,
    @quantity int,
    @price decimal(18,0),
    @description text,
    @image NVARCHAR(MAX),
    @unit NVARCHAR(3),
    @slug NVARCHAR(250)
AS
BEGIN

                DECLARE @Basket TABLE (
                    id NVARCHAR(36)
                )
            -- email and product NOT NULL 
            IF EXISTS(
                SELECT distinct email,productId,vendorId,vendorName,vendorLogoUrl
                FROM Basket
                WHERE email = @email 
                AND vendorId=@vendorId
                AND vendorName=@vendorName
                AND vendorLogoUrl=@vendorLogoUrl
                AND productId = @productId
                AND isActive =1 
            )
            BEGIN
                EXEC SP_IncreaseQuantity @email,@productId,@quantity,@vendorId,@vendorName
                Select * From Basket Where email=@email AND productId=@productId AND vendorId=@vendorId AND vendorName=@vendorName AND isActive=1
            END
            ELSE
            BEGIN
                INSERT INTO [dbo].[Basket]
                (
                    [email],[vendorId],[vendorName],[vendorLogoUrl],[productId],[name], [quantity], [price],[description],[image],[unit],[slug]
                )
                OUTPUT inserted.id INTO @Basket
                VALUES
                (
                    @email,@vendorId,@vendorName,@vendorLogoUrl,@productId,@name, @quantity, @price ,@description, @image,@unit,@slug
                )
            END    

            DECLARE @insertedId NVARCHAR(36)
            SET @insertedId = (SELECT id FROM @Basket)

            SELECT * FROM Basket
            WHERE @insertedId = id
END
GO
/****** Object:  StoredProcedure [dbo].[SP_DecreaseQuantityAndPriceItem]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Create the stored procedure in the specified schema
CREATE       PROCEDURE [dbo].[SP_DecreaseQuantityAndPriceItem]
    @email NVARCHAR(36),
    @productId NVARCHAR(36)
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN
        DECLARE @defaultQuantity INT=1

        DECLARE @numberProduct INT
        SET @numberProduct = (
            Select quantity 
            from Basket
            WHERE email=@email 
            AND productId=@productId
            AND quantity > 0
            AND isActive = 1
        )
         DECLARE @CheckProductId NVARCHAR
            SET @CheckProductId = (
                SELECT productId
                FROM Basket
                WHERE productId=@productId
                AND isActive=1 
                AND email=@email
            ) 

        IF (@CheckProductId IS NOT NULL AND @numberProduct > 1 )
        BEGIN
            UPDATE Basket
            SET quantity=quantity - @defaultQuantity
            WHERE email=@email
            AND Basket.isActive=1
            AND @productId=productId
            
            SELECT Basket.* 
            FROM Basket 
            WHERE @productId=Basket.productId 
            AND email =@email 
            AND isActive=1
        END
        ELSE 
        BEGIN
            SELECT CAST(0 AS BIT) as product
        END

        IF @@TRANCOUNT > 0
        BEGIN
            COMMIT TRAN
        END
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRAN
        END
        SELECT ERROR_MESSAGE() AS ErrorMessage
    END CATCH

END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetBasketWithAllItem]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE      PROCEDURE [dbo].[SP_GetBasketWithAllItem]
    @email NVARCHAR(255)
AS
BEGIN
        -- SELECT ISNULL((
        --     SELECT Basket.*
        --     FROM Basket
        --     WHERE Basket.email=@email
        --     AND isActive=1
        --     ORDER BY Basket.email 
        --     FOR JSON PATH
        -- ),'[]')

        SELECT Basket.*
            FROM Basket
            WHERE Basket.email=@email
            AND isActive=1
            ORDER BY Basket.vendorId,Basket.vendorName,Basket.createdAt 
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetNumberItem]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE    PROCEDURE [dbo].[SP_GetNumberItem]
    @email NVARCHAR(255)
AS
BEGIN
    SELECT COUNT(distinct productId) as 'numberProducts'
    FROM Basket
    WHERE Basket.email = @email
    AND isActive=1
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetTotalPriceInBasketForEmail]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE     PROCEDURE [dbo].[SP_GetTotalPriceInBasketForEmail]
    @email NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN
    DECLARE @getEmail NVARCHAR(255)
    SET @getEmail = (
        Select DISTINCT Basket.email
        FROM Basket
        WHERE @email = Basket.email
        AND isActive = 1 
    )

    IF(@getEmail IS NOT NULL)
    BEGIN
        SELECT distinct unit, SUM(price * quantity) as totalPrice,SUM(quantity) as totalQuantity
        FROM Basket
        WHERE email = @getEmail 
        AND isActive = 1 
        GROUP BY unit
    END
    ELSE 
        BEGIN
            SELECT CAST(0 AS BIT) as result
        END
    IF @@TRANCOUNT > 0
        BEGIN
            COMMIT TRAN
        END
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRAN
        END
        SELECT ERROR_MESSAGE() AS ErrorMessage
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetTotalProduct]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[SP_GetTotalProduct]
    @email NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN
            DECLARE @getEmail NVARCHAR(255)
            SET @getEmail = (
                Select DISTINCT Basket.email
                FROM Basket
                WHERE @email = Basket.email
                AND isActive = 1 
            )

            IF(@getEmail IS NOT NULL)
            BEGIN
                SELECT COUNT(Basket.productId) as total
                FROM Basket
                WHERE email = @getEmail 
                AND isActive = 1 
            END
            ELSE 
                BEGIN
                    SELECT CAST(0 AS BIT) as result
                END
            IF @@TRANCOUNT > 0
                BEGIN
                    COMMIT TRAN
                END
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRAN
        END
        SELECT ERROR_MESSAGE() AS ErrorMessage
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_IncreaseQuantity]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_IncreaseQuantity]
   @email NVARCHAR(36),
   @productId  NVARCHAR(36),
   @quantity INT,
   @vendorId NVARCHAR(36),
   @vendorName NVARCHAR(50)
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN
            DECLARE @numberProduct INT
            SET @numberProduct = (
                Select quantity 
                from Basket
                WHERE email=@email 
                AND productId=@productId
                AND vendorId =@vendorId
                AND vendorName=@vendorName
                AND quantity > 0
                AND isActive = 1
            )                
            DECLARE @CheckProductId NVARCHAR
            SET @CheckProductId = (
                SELECT productId
                FROM Basket
                WHERE productId=@productId
                AND vendorId=@vendorId
                AND vendorName=@vendorName
                AND isActive=1 
                AND email=@email
            ) 
            If ( @CheckProductId IS NOT NULL AND @numberProduct > 0)    
                BEGIN
                    UPDATE Basket
                    SET quantity=quantity + @quantity
                    WHERE email=@email
                    AND @productId=productId
                    AND vendorId=@vendorId
                    AND vendorName=@vendorName
                    AND isActive=1
                    
                    SELECT Basket.* 
                    FROM Basket 
                    WHERE @productId = Basket.productId 
                    AND email = @email 
                    AND isActive=1
                END
            ELSE 
            BEGIN
                SELECT CAST(0 AS BIT) as product
            END

            IF @@TRANCOUNT > 0
            BEGIN
                COMMIT TRAN
            END
        END TRY
        BEGIN CATCH
            IF @@TRANCOUNT > 0
            BEGIN
                ROLLBACK TRAN
            END
            SELECT ERROR_MESSAGE() AS ErrorMessage
        END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_IncreaseQuantityAndPriceItem]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Create the stored procedure in the specified schema
CREATE       PROCEDURE [dbo].[SP_IncreaseQuantityAndPriceItem]
    @email NVARCHAR(36),
    @productId  NVARCHAR(36)
AS

BEGIN
 BEGIN TRY
        BEGIN TRAN
            DECLARE @defaultQuantity INT=1
            DECLARE @numberProduct INT
            SET @numberProduct = (
                Select distinct quantity 
                from Basket
                WHERE email=@email 
                AND productId=@productId
                AND quantity > 0
                AND isActive = 1
            )                
            DECLARE @CheckProductId NVARCHAR
            SET @CheckProductId = (
                SELECT productId
                FROM Basket
                WHERE productId=@productId
                AND isActive=1 
                AND email=@email
            ) 
            If ( @CheckProductId IS NOT NULL AND @numberProduct > 0)    
                BEGIN
                    UPDATE Basket
                    SET quantity=quantity + @defaultQuantity
                    WHERE email=@email
                    AND @productId=productId
                    AND isActive=1
                    
                    SELECT Basket.* 
                    FROM Basket 
                    WHERE @productId = Basket.productId 
                    AND email = @email 
                    AND isActive=1
                END
            ELSE 
            BEGIN
                SELECT CAST(0 AS BIT) as product
            END

            IF @@TRANCOUNT > 0
            BEGIN
                COMMIT TRAN
            END
        END TRY
        BEGIN CATCH
            IF @@TRANCOUNT > 0
            BEGIN
                ROLLBACK TRAN
            END
            SELECT ERROR_MESSAGE() AS ErrorMessage
        END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_ProductPagination]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE      PROCEDURE [dbo].[SP_ProductPagination]
    @email NVARCHAR(255),
    @limit INT,
    @offset INT
AS
BEGIN  
    SELECT Basket.vendorId,Basket.vendorName,Basket.vendorLogoUrl,Basket.productId,Basket.name,Basket.[image],Basket.[description],Basket.quantity,Basket.price,Basket.unit,Basket.slug,createdAt
    FROM Basket
    WHERE Basket.email=@email
    AND isActive=1
    ORDER BY Basket.vendorId,Basket.vendorName,Basket.createdAt
    OFFSET @offset * @limit ROWS
    FETCH NEXT @limit ROWS ONLY
END
GO
/****** Object:  StoredProcedure [dbo].[SP_RemoveBasketForUser]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_RemoveBasketForUser]
    @email NVARCHAR(255)
AS
BEGIN
    DELETE FROM Basket
    WHERE @email =Basket.email
    AND isActive=1
END
GO
/****** Object:  StoredProcedure [dbo].[SP_RemoveItemInBasket]    Script Date: 12/8/2021 11:01:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Create the stored procedure in the specified schema
CREATE     PROCEDURE [dbo].[SP_RemoveItemInBasket]
    @email NVARCHAR(255),
    @productId  NVARCHAR(36),
    @limit INT,
    @offset INT
AS
BEGIN
    UPDATE Basket
    SET isActive=0
    WHERE Basket.productId=@productId
    AND Basket.email=@email
    AND Basket.productId IS NOT NULL
    AND Basket.email IS NOT NULL

    SELECT Basket.vendorId,Basket.vendorName,Basket.vendorLogoUrl,Basket.productId,Basket.name,Basket.[image],Basket.[description],Basket.quantity,Basket.price,Basket.unit,Basket.slug,createdAt
    FROM Basket
    WHERE Basket.email=@email
    AND isActive=1
    ORDER BY Basket.createdAt
    OFFSET @limit *(@offset+1)-1 ROWS
    FETCH NEXT @limit ROWS ONLY

END
GO
USE [master]
GO
ALTER DATABASE [Basket_Service_Db] SET  READ_WRITE 
GO
