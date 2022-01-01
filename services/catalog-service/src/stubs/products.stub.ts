export const productStub = () => {
  return {
    id: 'ABC-ID-ABC',
    categoryName: 'Child 1',
    name: 'Lap top 123',
    description: 'Lap top xin vl',
    stock: 20,
    price: {
      amount: 120,
      unit: 'VND',
    },
    slug: 'lap-top-123',
    attribute: [
      {
        name: 'spec',
        type: 'cau hinh',
        values: [
          {
            id: 2,
            attributeId: 8,
            value: 'i7',
          },
          {
            id: 3,
            attributeId: 8,
            value: '1080',
          },
          {
            id: 4,
            attributeId: 8,
            value: '16GB',
          },
        ],
      },
    ],
    attributeSet: [
      {
        name: 'set 1',
        attributes: [
          {
            name: 'type att set 1',
            type: 'name att set 1',
            attributes: {
              values: [
                {
                  value: 'value att set 1',
                },
              ],
            },
          },
        ],
      },
    ],
    images: [
      {
        imageUrl:
          'https://eshopcatalogservice.s3.ap-southeast-1.amazonaws.com/106508740_683559098864543_6387885008563588143_n.jpg',
        order: 1,
      },
      {
        imageUrl:
          'https://eshopcatalogservice.s3.ap-southeast-1.amazonaws.com/Razer-H1-Wallpaper-2560x1440_290520.png',
        order: 2,
      },
    ],
    brand: {
      id: 'c7e9363a-319a-46e4-9b1f-91ae46e04e02',
      name: 'Puma',
      logoUrl:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.3vwSl2HNBnDvKieP-hxTBQHaFl%26pid%3DApi&f=1',
    },
  };
};
