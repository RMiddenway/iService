import { useEffect, useState } from "react";
import { Grid, Header } from "semantic-ui-react";

import CardContainer from "../components/CardContainer";
import ExpertCard from "../components/ExpertCard";
import HeaderImage from "../components/HeaderImage";
import NewsletterSignUp from "../components/NewsletterSignUp";
import SocialMedia from "../components/SocialMedia";

const HomePage = () => {
  const [experts, setExperts] = useState([]);

  const getExperts = () => {
    fetch("http://localhost:5100/api/users?expert=true&count=8&sortby=rating", {
      method: "get",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setExperts(data);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  useEffect(() => {
    getExperts();
  }, []);

  return (
    <>
      <HeaderImage className="m-5 p-5"></HeaderImage>
      <Header as="h1">Featured Experts</Header>
      <CardContainer cardType="expert" cards={experts}></CardContainer>
      <Grid className="bg-light">
        <Grid.Column width="10" verticalAlign="middle">
          <NewsletterSignUp></NewsletterSignUp>
        </Grid.Column>
        <Grid.Column width="6" verticalAlign="middle">
          <SocialMedia></SocialMedia>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default HomePage;
