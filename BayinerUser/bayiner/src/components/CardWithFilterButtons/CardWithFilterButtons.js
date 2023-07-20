import "./CardWithFilterButtons.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useEffect, useState } from "react";
import { Filter1, TramSharp } from "@mui/icons-material";
import CoffeeIcon from '@mui/icons-material/Coffee';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

function FilterButton({ button, handleClick, active }) {
    const activeStyle = "bg-fourth text-white border-white";
    const passiveStyle =
      "bg-white text-fourth border-fourth hover:bg-fourth hover:text-white ";
    return (
      <div className="flex justify-center gap-2 md:gap-4">
        <button
          onClick={() => {
            handleClick(0);
          }}
          className={`${button} ${
            active === 0 ? activeStyle : passiveStyle
          }`}
        >
          Bugün
        </button>
        <button
          onClick={() => {
            handleClick(1);
          }}
          className={`${button} ${
            active === 1 ? activeStyle : passiveStyle
          }`}
        >
          Dün
        </button>
        <button
          onClick={() => {
            handleClick(2);
          }}
          className={`${button} ${
            active === 2 ? activeStyle : passiveStyle
          }`}
        >
          Haftalık
        </button>
        <button
          onClick={() => {
            handleClick(3);
          }}
          className={`${button} ${
            active === 3 ? activeStyle : passiveStyle
          }`}
        >
          Aylık
        </button>
        <button
          onClick={() => {
            handleClick(4);
          }}
          className={`${button} ${
            active === 4 ? activeStyle : passiveStyle
          }`}
        >
          Yıllık
        </button>
      </div>
    );
  }

const CardWithFilterButtons = () => {
      
  return (
    <div className="widgetF">
      <div className="left">
        <span className="title">Filter Graph By</span>
        <FilterButton button={
                "p-2 border-2 rounded-md"
              }/>
      </div>
    </div>
  );
};

export default CardWithFilterButtons;