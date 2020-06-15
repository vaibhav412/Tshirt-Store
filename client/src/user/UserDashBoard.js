import React from "react";
import Base from "../core/Base";
// // import { getOrders } from "../core/helper/orderHelper";
// import { isAutheticated } from "../auth/helper";

const UserDashBoard = () => {

  // const { user, token } = isAutheticated();

  // const getAllOrders = () => {
  //   getOrders(user._id, token).then(response => {
  //     console.log("DATA", response)
  //   })
  // };

  return (
    <Base title="UserDashBoard page">
      <h1>This is UserDashBoard page</h1>

    </Base>
  );
};

export default UserDashBoard;
