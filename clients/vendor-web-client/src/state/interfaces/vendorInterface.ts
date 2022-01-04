interface FetchVendor {
  type: "FETCH";
  payload: any;
}

interface GetVendor {
  type: "GET";
}

export type VendorAction = FetchVendor | GetVendor;
