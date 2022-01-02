import React, { useState } from "react";
import { useHistory } from "react-router";

interface SearchCouponButtonProps {}

const SearchCouponButton: React.FC<SearchCouponButtonProps> = () => {
  const history = useHistory();

  const [name, setName] = useState("");

  function handleChangeName(couponName: string) {
    if (couponName === "" || undefined) {
      history.push({
        pathname: "/admin/coupons",
        search: `?limit=6&offset=0`,
      });
      return;
    }

    history.push({
      pathname: "/admin/coupons",
      search: `?limit=6&offset=0&couponName=${couponName}`,
    });
  }

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        handleChangeName(name);
      }}
    >
      <input
        className="border-2 border-gray-300 bg-white h-10 pl-2 pr-8 rounded-lg text-sm focus:outline-none"
        type="text"
        placeholder="Quick Search"
        onChange={(e) => setName(e.target.value)}
      />
      <button className="absolute top-0 left-44 mt-3" type="submit">
        <svg
          className="text-gray-600 h-4 w-4 fill-current"
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          viewBox="0 0 56.966 56.966"
          xmlSpace="preserve"
          width="512px"
          height="512px"
        >
          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
        </svg>
      </button>
    </form>
  );
};

export default SearchCouponButton;
