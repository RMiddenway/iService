import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

import { setSignedOut } from '../auth/authSlice';

const NavBar = () => {
  const isSignedIn = localStorage.getItem("IS_SIGNED_IN") === "true";
  const userType = localStorage.getItem("USER_TYPE");
  const dispatch = useDispatch();
  const history = useHistory();
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (e) => {
    console.log(e.target.id);
    setActiveItem(e.target.id);
  };

  const handleSignOut = () => {
    fetch("/api/signout", {
      method: "get",
    })
      .then((response) => {
        if (response.status === 200) {
          dispatch(setSignedOut());
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
    <Menu className="color-danger">
      <Menu.Item
        as={Link}
        to={match.url}
        id="home"
        header
        onClick={(e) => handleItemClick(e)}
      >
        <Icon name="cog" color={activeItem === "home" ? "teal" : ""} />
        IService
      </Menu.Item>
      <Menu.Item
        as={Link}
        to={`${match.url}posttask`}
        id="postATask"
        active={activeItem === "postATask"}
        onClick={(e) => handleItemClick(e)}
      >
        <Icon
          name="add square"
          color={activeItem === "postATask" ? "teal" : ""}
        />
        Post a task
      </Menu.Item>
      {userType !== "expert" ? (
        <Menu.Item
          as={Link}
          to={`${match.url}becomeexpert`}
          id="becomeAnExpert"
          active={activeItem === "becomeAnExpert"}
          onClick={(e) => handleItemClick(e)}
        >
          <Icon
            name="user"
            color={activeItem === "becomeAnExpert" ? "teal" : ""}
          />
          Become an expert
        </Menu.Item>
      ) : (
        ""
      )}
      {userType === "expert" ? (
        <Menu.Item
          as={Link}
          to={`${match.url}expertarea`}
          id="expertArea"
          active={activeItem === "expertArea"}
          onClick={(e) => handleItemClick(e)}
        >
          <Icon name="user" color={activeItem === "expertArea" ? "teal" : ""} />
          Expert Area
        </Menu.Item>
      ) : (
        ""
      )}

      {userType === "expert" ? (
        <Menu.Item
          as={Link}
          to={`${match.url}findtask`}
          // to="/findtasks"
          id="findTasks"
          active={activeItem === "findTasks"}
          onClick={(e) => handleItemClick(e)}
        >
          <Icon
            name="search"
            color={activeItem === "findTasks" ? "teal" : ""}
          />
          Find tasks
        </Menu.Item>
      ) : (
        <Menu.Item
          as={Link}
          to={`${match.url}mytasks`}
          id="myTasks"
          active={activeItem === "myTasks"}
          onClick={(e) => handleItemClick(e)}
        >
          <Icon name="search" color={activeItem === "myTasks" ? "teal" : ""} />
          My tasks
        </Menu.Item>
      )}
      <Menu.Item
        id="howItWorks"
        as={Link}
        to={`${match.url}howitworks`}
        active={activeItem === "howItWorks"}
        onClick={(e) => handleItemClick(e)}
      >
        <Icon
          name="question circle"
          color={activeItem === "howItWorks" ? "teal" : ""}
        />
        How it works
      </Menu.Item>
      {isSignedIn ? (
        <Menu.Item
          position="right"
          id="signOut"
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
          to={`${match.url}signin`}
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
