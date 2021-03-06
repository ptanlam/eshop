USE [master]
GO
/****** Object:  Database [Coupon_Service_Db]    Script Date: 12/8/2021 11:05:11 PM ******/
CREATE DATABASE [Coupon_Service_Db]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Coupon_Service_Db', FILENAME = N'/var/opt/mssql/data/Coupon_Service_Db.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Coupon_Service_Db_log', FILENAME = N'/var/opt/mssql/data/Coupon_Service_Db_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [Coupon_Service_Db] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Coupon_Service_Db].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Coupon_Service_Db] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET ARITHABORT OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Coupon_Service_Db] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Coupon_Service_Db] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET  ENABLE_BROKER 
GO
ALTER DATABASE [Coupon_Service_Db] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Coupon_Service_Db] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET RECOVERY FULL 
GO
ALTER DATABASE [Coupon_Service_Db] SET  MULTI_USER 
GO
ALTER DATABASE [Coupon_Service_Db] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Coupon_Service_Db] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Coupon_Service_Db] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Coupon_Service_Db] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Coupon_Service_Db] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Coupon_Service_Db] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'Coupon_Service_Db', N'ON'
GO
ALTER DATABASE [Coupon_Service_Db] SET QUERY_STORE = OFF
GO
USE [Coupon_Service_Db]
GO
/****** Object:  Table [dbo].[AccumulatePoint]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccumulatePoint](
	[id] [nvarchar](36) NOT NULL,
	[email] [nvarchar](255) NULL,
	[basePoint] [int] NULL,
	[createdAt] [datetime2](0) NULL,
	[updatedAt] [datetime2](0) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AccumulatePoint_Details]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccumulatePoint_Details](
	[id] [nvarchar](36) NOT NULL,
	[accumulatePointId] [nvarchar](36) NULL,
	[orderId] [nvarchar](36) NULL,
	[totalPrice] [decimal](18, 2) NULL,
	[unit] [nvarchar](3) NULL,
	[createdAt] [datetime2](0) NULL,
	[updatedAt] [datetime2](0) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Coupon]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Coupon](
	[id] [nvarchar](36) NOT NULL,
	[code] [nvarchar](10) NOT NULL,
	[couponName] [nvarchar](250) NULL,
	[description] [nvarchar](250) NULL,
	[couponType] [nvarchar](20) NULL,
	[modifier] [int] NULL,
	[amount] [decimal](18, 2) NULL,
	[unit] [nvarchar](3) NULL,
	[usage] [int] NULL,
	[limit] [int] NULL,
	[startTime] [datetime2](0) NULL,
	[endTime] [datetime2](0) NULL,
	[pointToAchieve] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[createdAt] [datetime2](0) NULL,
	[updatedAt] [datetime2](0) NULL,
PRIMARY KEY CLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User_Coupon]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User_Coupon](
	[id] [nvarchar](36) NOT NULL,
	[couponCode] [nvarchar](10) NULL,
	[couponEmail] [nvarchar](255) NULL,
	[quantity] [int] NOT NULL,
	[isActive] [bit] NULL,
	[createdAt] [datetime2](0) NULL,
	[updatedAt] [datetime2](0) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AccumulatePoint] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[AccumulatePoint] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[AccumulatePoint] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[AccumulatePoint_Details] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[AccumulatePoint_Details] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[AccumulatePoint_Details] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Coupon] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[Coupon] ADD  DEFAULT ((0)) FOR [modifier]
GO
ALTER TABLE [dbo].[Coupon] ADD  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Coupon] ADD  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[Coupon] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Coupon] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[User_Coupon] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[User_Coupon] ADD  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[User_Coupon] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[User_Coupon] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[AccumulatePoint_Details]  WITH CHECK ADD  CONSTRAINT [FK_AccumulatePoint_AccumulatePointDetails] FOREIGN KEY([accumulatePointId])
REFERENCES [dbo].[AccumulatePoint] ([id])
GO
ALTER TABLE [dbo].[AccumulatePoint_Details] CHECK CONSTRAINT [FK_AccumulatePoint_AccumulatePointDetails]
GO
/****** Object:  StoredProcedure [dbo].[SP_AddCoupon]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_AddCoupon]
    @couponName NVARCHAR(250),
    @couponType NVARCHAR(20),
    @description NVARCHAR(250),
    @modifier NVARCHAR(50),
    @amount DECIMAL(18,2),
    @unit NVARCHAR(3),
    @usage INT,
    @limit INT,
    @pointToAchieve INT,
    @startTime DATETIME2(0),
    @endTime DATETIME2(0)
AS
BEGIN
    DECLARE @Code NVARCHAR(10)
    SET @Code = SUBSTRING(CONVERT(varchar(40), NEWID()),0,9)

    DECLARE @Coupon TABLE (
      id NVARCHAR(36)
    )
    -- Insert rows into table 'Coupon' in schema '[dbo]'
    INSERT INTO [dbo].[Coupon]
    ( -- Columns to insert data into
      [code],[couponName],[description],[couponType],[modifier],[amount],[unit],[usage],[limit],[startTime],[endTime],[pointToAchieve]
    )
    OUTPUT inserted.id INTO @Coupon
    VALUES
    ( -- First row: values for the columns in the list above
      @Code,@couponName,@description, @couponType, @modifier, @amount, @unit, @usage, @limit, @startTime,@endTime,@pointToAchieve
    )

    DECLARE @insertedId NVARCHAR(36)
    SET @insertedId = (SELECT id FROM @Coupon)

    SELECT * FROM Coupon
    WHERE @insertedId = id
    ORDER BY Coupon.createdAt DESC
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddCouponAndEmail]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_AddCouponAndEmail]
   @email NVARCHAR(255),
   @code NVARCHAR(10),
   @quantity INT
AS
BEGIN 
    DECLARE @UserCoupon TABLE(
        id NVARCHAR(36)
    )
            IF EXISTS(
                        SELECT distinct couponEmail,couponCode
                        FROM User_Coupon
                        WHERE couponEmail = @email 
                        AND couponCode=@code
                        AND isActive =1 
                        AND quantity > 0
                    )
            BEGIN
                EXEC SP_IncreaseQuantity @email,@code,@quantity
                Select * From User_Coupon Where couponEmail=@email AND couponCode=@code AND isActive=1 
            END
            ELSE
            BEGIN
                INSERT INTO [dbo].[User_Coupon]
                ( 
                    [couponCode],[couponEmail],[quantity]
                )
                OUTPUT inserted.id INTO @UserCoupon
                VALUES
                ( 
                    @code,@email,@quantity
                )
            END

    DECLARE @insertedId NVARCHAR(36)
    SET @insertedId = (SELECT id FROM @UserCoupon)

    SELECT * FROM User_Coupon
    WHERE @insertedId = id


    DECLARE @pointCoupon INT
    SET @pointCoupon = (
    SELECT Coupon.pointToAchieve
    FROM Coupon
    WHERE @code = Coupon.code
    AND isActive = 1
    AND isDeleted = 0
    AND endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
    )

    UPDATE AccumulatePoint
    SET basePoint = basePoint - (CAST(@pointCoupon as float)*@quantity)
    WHERE AccumulatePoint.email=@email

    UPDATE Coupon 
    SET usage = usage + @quantity
    WHERE Coupon.code=@code
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddPointForUser]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_AddPointForUser]
    @email NVARCHAR(255),
    @basePoint INT
AS
BEGIN

    IF EXISTS(
        SELECT email
        FROM AccumulatePoint
        WHERE email = @email
        AND email IS NOT NULL
    )
    BEGIN
        EXEC SP_IncreasePointForUser @email,@basePoint
    END
    ELSE
    BEGIN
           INSERT INTO [dbo].[AccumulatePoint]
            ( -- Columns to insert data into
                [email],[basePoint]
            )
            OUTPUT inserted.*
            VALUES
            ( 
                @email,@basePoint
            )
    END
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddPointForUser_Details]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[SP_AddPointForUser_Details]
    @accumulatePointId NVARCHAR(36)=NULL,
    @orderId NVARCHAR(36),
    @totalPrice DECIMAL(18,2),
    @unit NVARCHAR(3)
AS
BEGIN

            INSERT INTO [dbo].[AccumulatePoint_Details]
            ( -- Columns to insert data into
               [accumulatePointId],[orderId],[totalPrice],[unit]
            )
            OUTPUT inserted.*
            VALUES
            ( 
               @accumulatePointId,@orderId,@totalPrice,@unit
            )
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllCouponForAdmin]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_GetAllCouponForAdmin]
    @limit INT,
    @offset INT
AS
BEGIN
        Select distinct *
        From Coupon
        WHERE isDeleted = 0
        AND endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
        ORDER BY Coupon.createdAt DESC
        OFFSET @offset * @limit ROWS
        FETCH NEXT @limit ROWS ONLY
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllCouponForUser]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_GetAllCouponForUser]
    @email NVARCHAR(255),
    @limit INT,
    @offset INT
AS
BEGIN
    SELECT User_Coupon.couponEmail as 'email',Coupon.id,Coupon.couponName,User_Coupon.couponCode as 'code',Coupon.couponType,Coupon.modifier,Coupon.amount,Coupon.unit,User_Coupon.quantity,User_Coupon.createdAt
    FROM  User_Coupon,Coupon
    WHERE User_Coupon.quantity >= 1
    AND User_Coupon.isActive = 1
    AND User_Coupon.couponCode = Coupon.code
    AND User_Coupon.couponEmail=@email
    AND User_Coupon.couponCode IN (
        SELECT code 
        FROM Coupon
        WHERE Coupon.code = User_Coupon.couponCode
        AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
    )
    ORDER BY User_Coupon.createdAt
    OFFSET @offset * @limit ROWS
    FETCH NEXT @limit ROWS ONLY
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetCouponByCouponCode]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_GetCouponByCouponCode]
   @code NVARCHAR(250)
AS
BEGIN
    SELECT Coupon.* 
    FROM Coupon
    WHERE Coupon.code = @code
    AND endTime >= DATEADD(HOUR,7,CAST(GETDATE() AS datetime2(0)))
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetCouponByCouponCodeForAdmin]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_GetCouponByCouponCodeForAdmin]
   @code NVARCHAR(250),
   @limit INT,
   @offset INT
AS
BEGIN
    SELECT Coupon.* 
    FROM Coupon
    WHERE Coupon.code = @code
    AND isDeleted = 0
    AND endTime >= DATEADD(HOUR,7,CAST(GETDATE() AS datetime2(0)))
    ORDER BY Coupon.createdAt
    OFFSET @offset * @limit ROWS
    FETCH NEXT @limit ROWS ONLY
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetCouponByCouponNameForAdmin]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_GetCouponByCouponNameForAdmin]
   @couponName NVARCHAR(250),
   @limit INT,
   @offset INT
AS
BEGIN
    SELECT distinct Coupon.* 
    FROM Coupon
    WHERE Coupon.couponName LIKE (ISNULL(@couponName,'')+'%')
    AND isDeleted = 0
    AND endTime > DATEADD(HOUR,7,CAST(GETDATE() AS datetime2(0)))
    ORDER BY Coupon.createdAt
    OFFSET @offset * @limit ROWS
    FETCH NEXT @limit ROWS ONLY
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetCouponByCouponType]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[SP_GetCouponByCouponType]
    @couponType NVARCHAR(20),
    @limit INT,
    @offset INT
AS
BEGIN
    SELECT *
    FROM Coupon
    WHERE Coupon.couponType = @couponType
    AND isDeleted = 0
    AND endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
    ORDER BY pointToAchieve,Coupon.createdAt
    OFFSET @offset * @limit ROWS
    FETCH NEXT @limit ROWS ONLY
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetListOptionalPromotionForUser]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[SP_GetListOptionalPromotionForUser]
    @limit INT,
    @offset INT
AS
BEGIN
                IF EXISTS(
                    SELECT distinct *
                    FROM Coupon
                    WHERE Coupon.isDeleted = 0
                    AND isActive = 1
                    AND usage < limit
                    AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                )
                BEGIN
                    Select distinct id,code,couponName,[description],couponType,modifier,amount,unit,startTime,endTime,pointToAchieve,createdAt
                    From Coupon
                    WHERE isDeleted = 0
                    AND isActive = 1
                    AND endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                    ORDER BY pointToAchieve,Coupon.createdAt ASC
                    OFFSET @offset * @limit ROWS
                    FETCH NEXT @limit ROWS ONLY
                END
                ELSE
                IF EXISTS(
                    SELECT distinct *
                    FROM Coupon
                    WHERE Coupon.isDeleted = 0
                    AND isActive = 1
                    AND limit = 0
                    AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                )
                BEGIN
                    Select distinct id,code,couponName,[description],couponType,modifier,amount,unit,startTime,endTime,pointToAchieve,createdAt
                    From Coupon
                    WHERE isDeleted = 0
                    AND isActive = 1
                    AND endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                    ORDER BY couponType,pointToAchieve,Coupon.createdAt ASC
                    OFFSET @offset * @limit ROWS
                    FETCH NEXT @limit ROWS ONLY
                END
END 
GO
/****** Object:  StoredProcedure [dbo].[SP_GetTotalCouponNameForAdmin]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[SP_GetTotalCouponNameForAdmin]
    @couponName NVARCHAR(250)
AS
BEGIN
         DECLARE @CountCouponLimited INT
                SET @CountCouponLimited = (
                    SELECT COUNT( Coupon.code) as 'total'
                    FROM Coupon
                    WHERE Coupon.isDeleted = 0 
                    AND Coupon.couponName LIKE (ISNULL(@couponName,'')+'%')
                    AND usage < limit
                    AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                )

                
                DECLARE @CountCouponUnlimited INT
                SET @CountCouponUnlimited = (
                    SELECT COUNT( Coupon.code) as 'total'
                    FROM Coupon
                    WHERE Coupon.isDeleted = 0
                    AND limit = 0
                    AND Coupon.couponName LIKE (ISNULL(@couponName,'')+'%')
                    AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                )

                Select @CountCouponLimited + @CountCouponUnlimited AS 'total'
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetTotalCoupons]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_GetTotalCoupons]
    @email NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN
            DECLARE @getEmail NVARCHAR(255)
            SET @getEmail = (
                Select distinct User_Coupon.couponEmail
                FROM AccumulatePoint,User_Coupon
                WHERE @email = AccumulatePoint.email
                AND @email =User_Coupon.couponEmail
                AND User_Coupon.couponEmail=AccumulatePoint.email
                AND isActive = 1 
            )

            IF(@getEmail IS NOT NULL)
            BEGIN
                -- SELECT COUNT(distinct User_Coupon.couponCode) as 'totalCouponCode'
                -- FROM User_Coupon,Coupon,AccumulatePoint
                -- WHERE Coupon.code = User_Coupon.couponCode
                -- AND AccumulatePoint.email=@email
                -- AND AccumulatePoint.email=User_Coupon.couponEmail
                -- AND User_Coupon.couponEmail=@email

                SELECT COUNT( User_Coupon.couponCode) as 'total'
                FROM User_Coupon,Coupon
                WHERE Coupon.code = User_Coupon.couponCode
                AND User_Coupon.quantity >= 1
                AND User_Coupon.isActive = 1
                AND User_Coupon.couponEmail=@email
                AND User_Coupon.couponCode IN (
                    SELECT distinct code
                    FROM Coupon
                    WHERE  Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                    AND couponCode = Coupon.code
                )
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
/****** Object:  StoredProcedure [dbo].[SP_GetTotalCouponsForAdmin]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_GetTotalCouponsForAdmin]
AS
BEGIN

                DECLARE @CountCouponLimited INT
                SET @CountCouponLimited = (
                    SELECT COUNT( Coupon.code) as 'total'
                    FROM Coupon
                    WHERE Coupon.isDeleted = 0 
                    AND usage < limit
                    AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                )

                
                DECLARE @CountCouponUnlimited INT
                SET @CountCouponUnlimited = (
                    SELECT COUNT( Coupon.code) as 'total'
                    FROM Coupon
                    WHERE Coupon.isDeleted = 0
                    AND limit = 0
                    AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                )

                Select @CountCouponLimited + @CountCouponUnlimited AS 'total'
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetTotalCouponTypeForAdmin]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_GetTotalCouponTypeForAdmin]
    @couponType NVARCHAR(20)
AS
BEGIN

                DECLARE @CountCouponLimited INT
                SET @CountCouponLimited = (
                    SELECT COUNT( Coupon.code) as 'total'
                    FROM Coupon
                    WHERE Coupon.isDeleted = 0 
                    AND couponType = @couponType
                    AND usage < limit
                    AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                )

                
                DECLARE @CountCouponUnlimited INT
                SET @CountCouponUnlimited = (
                    SELECT COUNT( Coupon.code) as 'total'
                    FROM Coupon
                    WHERE Coupon.isDeleted = 0
                    AND limit = 0
                    AND couponType = @couponType
                    AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                )

                Select @CountCouponLimited + @CountCouponUnlimited AS 'total'
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetTotalOptionalPromotionForUser]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_GetTotalOptionalPromotionForUser]
AS
BEGIN

                DECLARE @CountCouponLimited INT
                SET @CountCouponLimited = (
                    SELECT COUNT( Coupon.code) as 'total'
                    FROM Coupon
                    WHERE Coupon.isDeleted = 0 
                    AND isActive = 1
                    AND usage < limit
                    AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                )

                
                DECLARE @CountCouponUnlimited INT
                SET @CountCouponUnlimited = (
                    SELECT COUNT( Coupon.code) as 'total'
                    FROM Coupon
                    WHERE Coupon.isDeleted = 0
                    AND isActive = 1 
                    AND limit = 0
                    AND Coupon.endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0)))
                )

                Select @CountCouponLimited + @CountCouponUnlimited AS 'total'
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetTotalPointForUser]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_GetTotalPointForUser]
    @email NVARCHAR(255)
AS
BEGIN
        SELECT basePoint as 'point',COUNT(orderId) as 'totalOrder'
        FROM AccumulatePoint,AccumulatePoint_Details
        WHERE email=@email
        AND AccumulatePoint.id=AccumulatePoint_Details.accumulatePointId
        GROUP BY basePoint,email
END
GO
/****** Object:  StoredProcedure [dbo].[SP_IncreasePointForUser]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[SP_IncreasePointForUser]
    @email NVARCHAR(36),
    @basePoint INT
AS
BEGIN
     BEGIN TRY
        BEGIN TRAN
            DECLARE @emailExist NVARCHAR(36)
            SET @emailExist = (
                Select email 
                from AccumulatePoint
                WHERE email=@email 
                AND basePoint >= 0
            )                
            If ( @emailExist IS NOT NULL )    
                BEGIN
                    UPDATE AccumulatePoint
                    SET basePoint=basePoint + @basePoint
                    WHERE email=@email
                    
                    SELECT id,email,basePoint as 'point'
                    FROM AccumulatePoint 
                    WHERE @email = AccumulatePoint.email 
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
/****** Object:  StoredProcedure [dbo].[SP_IncreaseQuantity]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_IncreaseQuantity]
   @email NVARCHAR(255),
   @code NVARCHAR(10),
   @quantity INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN
            DECLARE @numberCode INT
            SET @numberCode = (
                Select quantity 
                from User_Coupon
                WHERE couponEmail=@email 
                AND couponCode=@code
                AND quantity > 0
                AND isActive = 1
            )                
            DECLARE @CheckCode NVARCHAR
            SET @CheckCode = (
                SELECT couponCode
                FROM User_Coupon
                WHERE couponCode = @code
                AND couponCode IN (
                    Select code 
                    From Coupon
                    WHERE isDeleted = 0
                    AND endTime > DATEADD(HOUR,7,CAST(GETDATE() AS DATETIME2(0)))
                )
                AND couponEmail=@email
                AND isActive=1 
            ) 
            If ( @CheckCode IS NOT NULL AND @numberCode > 0)    
                BEGIN
                    UPDATE User_Coupon
                    SET quantity=quantity + @quantity
                    WHERE couponEmail=@email
                    AND @code=couponCode
                    AND isActive=1
                    
                    SELECT User_Coupon.* 
                    FROM User_Coupon 
                    WHERE @code = User_Coupon.couponCode 
                    AND couponEmail = @email 
                    AND isActive=1
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
/****** Object:  StoredProcedure [dbo].[SP_ManipulateActiveForEachCoupon]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE [dbo].[SP_ManipulateActiveForEachCoupon]
    @id NVARCHAR(36)
AS
BEGIN
     BEGIN TRY
        BEGIN TRAN    

            If EXISTS(  
                Select id 
                from Coupon
                WHERE id=@id 
                AND isActive = 1
                AND isDeleted = 0
                AND endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0))) 
            )    
                BEGIN
                    UPDATE Coupon
                    SET isActive = 0
                    WHERE id = @id
                    AND isActive = 1
                    AND isDeleted = 0
                    AND endTime > DATEADD(HOUR,7,CAST(GETDATE() AS DATETIME2(0)))
                    
                    SELECT Coupon.* 
                    FROM Coupon
                    WHERE @id = id 
                    AND isDeleted = 0
                    AND endTime > DATEADD(HOUR,7,CAST(GETDATE() AS DATETIME2(0)))
                END

            ELSE 
            IF EXISTS(     
                Select id 
                from Coupon
                WHERE id=@id 
                AND isActive = 0
                AND isDeleted = 0
                AND endTime > DATEADD(HOUR, 7, CAST(GETDATE() AS DATETIME2(0))) 
            )
            BEGIN
                    UPDATE Coupon
                    SET isActive = 1
                    WHERE id = @id
                    AND isActive = 0
                    AND isDeleted = 0
                    AND endTime > DATEADD(HOUR,7,CAST(GETDATE() AS DATETIME2(0)))
                    
                    SELECT Coupon.* 
                    FROM Coupon
                    WHERE @id = id 
                    AND isDeleted = 0
                    AND endTime > DATEADD(HOUR,7,CAST(GETDATE() AS DATETIME2(0)))
            END
            ELSE 
            BEGIN
                SELECT CAST(0 AS BIT) as coupon
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
/****** Object:  StoredProcedure [dbo].[SP_RemoveCouponForAdmin]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_RemoveCouponForAdmin]
    @id NVARCHAR(36)
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN
            IF EXISTS(
                SELECT id
                FROM Coupon
                WHERE id = @id
                AND endTime > DATEADD(HOUR,7,CAST(GETDATE() AS DATETIME2(0)))
                AND isDeleted = 0
                AND id IS NOT NULL
                AND @id IS NOT NULL
            )
            BEGIN
                UPDATE Coupon
                SET isDeleted = 1
                WHERE id = @id
                AND isDeleted = 0
                AND endTime > DATEADD(HOUR,7,CAST(GETDATE() AS DATETIME2(0)))

                SELECT Coupon.*
                FROM Coupon
                WHERE @id = id 
            END
            ELSE
            BEGIN
                SELECT CAST(0 AS BIT) as coupon
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
/****** Object:  StoredProcedure [dbo].[SP_UpdateCouponBase]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_UpdateCouponBase]
   @id NVARCHAR(36),
   @couponName NVARCHAR(250) = NULL,
   @description NVARCHAR(250) = NULL,
   @couponType NVARCHAR(20) = NULL,
   @modifier INT =NULL,
   @amount DECIMAL(18,2) = NULL,
   @unit NVARCHAR(3) = NULL,
   @usage INT =NULL,
   @limit INT = NULL,
   @startTime DATETIME2(0) = NULL,
   @endTime DATETIME2(0) = NULL,
   @pointToAchieve INT = NULL
AS
BEGIN

    DECLARE @Coupon TABLE (
      id NVARCHAR(36)
    )
    -- Update rows in table '[Products]' in schema '[dbo]'
    UPDATE [dbo].[Coupon]
    SET
        [couponName] = ISNULL(@couponName,[couponName]),
        [description] = ISNULL(@description,[description]),
        [couponType] = ISNULL(@couponType,couponType),
        [modifier] = ISNULL(@modifier,modifier),
        [amount] = ISNULL(@amount,amount),
        [unit] = ISNULL(@unit,unit),
        [usage] = ISNULL(@usage,usage),
        [limit] = ISNULL(@limit,[limit]),
        [startTime] = ISNULL(@startTime,startTime),
        [endTime] = ISNULL(@endTime,endTime),
        [pointToAchieve]=ISNULL(@pointToAchieve,pointToAchieve)
    OUTPUT inserted.id INTO @Coupon
    WHERE id = @id

    DECLARE @insertedId NVARCHAR(36)
    SET @insertedId = (SELECT id FROM @Coupon)

    SELECT * FROM Coupon
    WHERE @insertedId = id
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateUserCouponTable]    Script Date: 12/8/2021 11:05:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
-- Create the stored procedure in the specified schema
CREATE   PROCEDURE [dbo].[SP_UpdateUserCouponTable]
    @email NVARCHAR(255),
    @code NVARCHAR(10)
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN
            IF EXISTS(
                SELECT * 
                FROM User_Coupon
                WHERE couponCode = @code 
                AND couponEmail = @email
                AND quantity > 1
                AND isActive = 1
            )
            BEGIN
                UPDATE User_Coupon
                SET quantity = quantity - 1
                WHERE couponEmail=@email
                AND couponCode = @code
            END
            ELSE
            IF EXISTS(
                SELECT *
                FROM User_Coupon
                WHERE couponCode = @code 
                AND couponEmail = @email
                AND quantity = 1
                AND isActive = 1
            )
            BEGIN
                UPDATE User_Coupon
                SET quantity = 0, isActive = 0
                WHERE couponEmail=@email
                AND couponCode = @code
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
USE [master]
GO
ALTER DATABASE [Coupon_Service_Db] SET  READ_WRITE 
GO
