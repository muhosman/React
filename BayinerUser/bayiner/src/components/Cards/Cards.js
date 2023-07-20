import "./Cards.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useEffect, useState } from "react";
import { TramSharp } from "@mui/icons-material";
import CoffeeIcon from "@mui/icons-material/Coffee";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";

const Cards = ({ type }) => {
  let data;

  switch (type) {
    case "coffee":
      data = {
        title: "Türk Kahve",
        info: "# of machines",
        icon: (
          <CoffeeIcon
            className="icon"
            style={{
              backgroundColor: "rgba(5, 47, 143, 0.9)",
              color: "white",
            }}
          />
        ),
      };
      break;
    case "tea":
      data = {
        title: "Çay",
        info: "# of machines",
        icon: (
          <EmojiFoodBeverageIcon
            className="icon"
            style={{
              backgroundColor: "rgba(5, 47, 143, 0.9)",
              color: "white",
            }}
          />
        ),
      };
      break;
    case "salep":
      data = {
        title: "Salep",
        info: "# of machines",
        icon: (
          <EmojiFoodBeverageIcon
            className="icon"
            style={{
              backgroundColor: "rgba(5, 47, 143, 0.9)",
              color: "white",
            }}
          />
        ),
      };
      break;
    case "filter":
      data = {
        title: "Filtre Kahve",
        info: "# of machines",
        icon: (
          <EmojiFoodBeverageIcon
            className="icon"
            style={{
              backgroundColor: "rgba(5, 47, 143, 0.9)",
              color: "white",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.info}</span>
      </div>
      <div className="right">{data.icon}</div>
    </div>
  );
};

export default Cards;
