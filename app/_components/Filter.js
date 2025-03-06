"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border border-primary-800 flex">
      <Button
        handleFilter={handleFilter}
        filter="all"
        activeFilter={activeFilter}
      >
        All Cabins
      </Button>
      <Button
        handleFilter={handleFilter}
        filter="small"
        activeFilter={activeFilter}
      >
        1&mdash;3 guests
      </Button>
      <Button
        handleFilter={handleFilter}
        filter="medium"
        activeFilter={activeFilter}
      >
        4&mdash;6 guests
      </Button>
      <Button
        handleFilter={handleFilter}
        filter="large"
        activeFilter={activeFilter}
      >
        7&mdash;10 guests
      </Button>
      {/* <button
        onClick={() => handleFilter("all")}
        className={`px-5 py-2 hover:bd-primary-700 ${
          activeFilter === "all" ? "bg-primary-900 text-primary-100" : ""
        }`}
      >
        All Cabins
      </button> */}
    </div>
  );
}

export default Filter;

function Button({ children, handleFilter, filter, activeFilter }) {
  function handleClick() {
    handleFilter(filter);
  }
  return (
    <button
      onClick={handleClick}
      className={`px-5 py-2 hover:bd-primary-700 ${
        activeFilter === filter ? "bg-primary-900 text-primary-100" : ""
      }`}
    >
      {children}
    </button>
  );
}