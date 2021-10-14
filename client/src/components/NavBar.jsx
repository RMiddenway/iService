import React, { useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Icon, Menu } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

const NavBar = () => {
  const history = useHistory();
  const [activeItem, setActiveItem] = useState("home");

  const isSignedIn = () => {
    return localStorage.getItem("IS_SIGNED_IN") === "true";
  };

  const handleItemClick = (e) => {
    console.log(e.target.id);
    setActiveItem(e.target.id);
  };

  const handleSignOut = () => {
    fetch("http://localhost:5100/signout", {
      method: "get",
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("IS_SIGNED_IN", "false");
        }
        return response.text();
      })
      .then((data) => history.push(data))
      .catch((err) => {
        console.log("Error", err);
      });
    setActiveItem("home");
  };

  let match = useRouteMatch();
  return (
    <Menu>
      <Menu.Item
        as={Link}
        to={match.url}
        header
        onClick={(e) => handleItemClick(e)}
      >
        IService
      </Menu.Item>
      <Menu.Item
        as={Link}
        to={`${match.url}posttask`}
        id="postATask"
        active={activeItem === "postATask"}
        onClick={(e) => handleItemClick(e)}
      >
        <Icon name="add square" />
        Post a task
      </Menu.Item>
      <Menu.Item
        id="becomeAnExpert"
        active={activeItem === "becomeAnExpert"}
        onClick={(e) => handleItemClick(e)}
      >
        <Icon name="user" />
        Become an expert
      </Menu.Item>
      {/* <Link to="/findtasks">Find</Link> */}
      <Menu.Item
        as={Link}
        to={`${match.url}findtask`}
        // to="/findtasks"
        id="findTasks"
        active={activeItem === "findTasks"}
        onClick={(e) => handleItemClick(e)}
      >
        <Icon name="search" />
        Find tasks
      </Menu.Item>
      <Menu.Item
        id="howItWorks"
        active={activeItem === "howItWorks"}
        onClick={(e) => handleItemClick(e)}
      >
        <Icon name="question circle" />
        How it works
      </Menu.Item>
      {isSignedIn() ? (
        <Menu.Item
          // as={Link}
          position="right"
          id="signOut"
          // to={`${match.url}signup`}
          active={activeItem === "signOut"}
          onClick={(e) => handleSignOut()}
        >
          <Icon name="lock" />
          Sign Out
        </Menu.Item>
      ) : (
        <Menu.Item
          as={Link}
          position="right"
          id="signIn"
          to={`${match.url}signup`}
          active={activeItem === "signIn"}
          onClick={(e) => handleItemClick(e)}
        >
          <Icon name="lock" />
          Sign In
        </Menu.Item>
      )}
    </Menu>
  );
};

export default NavBar;
