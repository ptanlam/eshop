using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using OrderingService.API.Application.Commands;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public static class OrderEndpointMixins
    {
        public static async Task<OrderDetailsDto> GetVendorAndProductForOrderDetails(Order order, 
            IMediator mediator, IMapper mapper)
        {
            var (vendor, receipt,items) = await GetComplementingInfoForOrder(mediator, mapper, 
                order.VendorId, order.ReceiptId, order.Items);

            var shippingAddress = await mediator.Send(new GetShippingAddressByIdCommand(
                order.ShippingAddressId));

            var customer = await mediator.Send(new GetCustomerByIdCommand(order.CustomerId));

            return mapper.Map<OrderDetailsDto>(order, opt =>
            {
                opt.Items["Items"] = items;
                opt.Items["Vendor"] = vendor;
                opt.Items["Receipt"] = receipt;
                opt.Items["Customer"] = customer;
                opt.Items["ShippingAddress"] = shippingAddress;
            });
        }
        
        public static async Task<IEnumerable<OrderDetailsShortenedDto>> GetVendorAndProductForOrders(
            IEnumerable<Order> orders, IMediator mediator, IMapper mapper)
        {
            var orderDtos = new List<OrderDetailsShortenedDto>();

            foreach (var order in orders)
            {
                var orderDto = await GetVendorAndProductForOrder(order, mediator, mapper);
                orderDtos.Add(orderDto);
            }

            return orderDtos;
        }

        private static async Task<OrderDetailsShortenedDto> GetVendorAndProductForOrder(Order order, IMediator mediator,
            IMapper mapper)
        {
            var (vendor, receipt,items) = await GetComplementingInfoForOrder(mediator, mapper, 
                order.VendorId, order.ReceiptId, order.Items);

            return mapper.Map<OrderDetailsShortenedDto>(order, opt =>
            {
                opt.Items["Items"] = items;
                opt.Items["Vendor"] = vendor;
                opt.Items["Receipt"] = receipt;
            });
        }

        private static async Task<(
            GetVendorInfoResponse vendor, 
            GetReceiptForOrderResponse receipt, 
            IEnumerable<ItemDetailsDto>)> 
            GetComplementingInfoForOrder(IMediator mediator, IMapper mapper,
                Guid vendorId, Guid receiptId, IEnumerable<Item> items)
        {
            var vendor = await mediator.Send(
                new GetVendorInfoCommand(vendorId));

            var receipt = await mediator.Send(
                new GetPaymentInfoCommand(receiptId));

            var itemDetails = await GetProductInfosForItemsAsync(items,
                mediator, mapper);
            
            return (vendor, receipt, itemDetails);
        }

        private static async Task<IEnumerable<ItemDetailsDto>> GetProductInfosForItemsAsync(
            IEnumerable<Item> items, IMediator mediator, IMapper mapper)
        {
            var itemDtos = new List<ItemDetailsDto>();

            foreach (var item in items)
            {
                var product = await mediator.Send(
                    new GetProductInfoCommand(item.ProductId));

                itemDtos.Add(mapper.Map<ItemDetailsDto>(item, opt =>
                {
                    opt.Items["Product"] = product;
                }));
            }

            return itemDtos;
        }
    }
}