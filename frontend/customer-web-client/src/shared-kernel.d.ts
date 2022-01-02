type UniqueId = string;

type Email = string;

type Image = {
  id: UniqueId;
  ownerId: UniqueId;
  url: string;
};

type Price = {
  amount: number;
  unit: string;
};

type AppError = {
  action: string;
  message: string;
};
