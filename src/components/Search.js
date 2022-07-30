import React from "react";
import Input from "./Input";

function Search({ search, setSearch }) {
  return (
    <Input
      placeholder="Search a user..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export default React.memo(Search);
