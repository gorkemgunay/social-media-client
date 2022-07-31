import React from "react";
import Input from "./Input";

function Search({ users, setSearchUsersResult }) {
  const handleSearchChange = (e) => {
    if (!e.target.value) {
      return setSearchUsersResult(users);
    }

    const resultsArray = users.filter(
      (user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        user.surname.toLowerCase().includes(e.target.value.toLowerCase()) ||
        `${user.name.toLowerCase()} ${user.surname.toLowerCase()}`.includes(
          e.target.value.toLowerCase(),
        ),
    );

    return setSearchUsersResult(resultsArray);
  };
  return <Input placeholder="Search a user..." onChange={handleSearchChange} />;
}

export default React.memo(Search);
