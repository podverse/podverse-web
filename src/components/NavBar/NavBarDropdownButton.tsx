import React, { useContext } from "react";
import { FaChevronDown, FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import styles from "../../styles/components/NavBar/NavBarDropdownButton.module.scss";
import { AccountContext } from "../../contexts/Account";

const NavBarDropdownButton: React.FC = () => {
  const { isLoggedIn } = useContext(AccountContext);

  const handleClick = () => {
    // Implement dropdown open/close logic here
    console.log("Dropdown button pressed");
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      {isLoggedIn ? (
        <FaUserCircle className={styles.profileIcon} />
      ) : (
        <FaRegUserCircle className={styles.profileIcon} />
      )}
      <FaChevronDown />
    </button>
  );
};

export default NavBarDropdownButton;