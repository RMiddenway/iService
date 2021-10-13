import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

const NavBar = () => {
  const [activeItem, setActiveItem] = useState("home");
  const handleItemClick = (e) => {
    console.log(e.target.id);
    setActiveItem(e.target.id);
    // e.preventDefault();
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
      <Menu.Item
        position="right"
        id="signIn"
        active={activeItem === "signIn"}
        onClick={(e) => handleItemClick(e)}
      >
        <Icon name="lock" />
        Sign In
      </Menu.Item>
    </Menu>
  );
};

export default NavBar;
