import { Grid, Header } from 'semantic-ui-react';

import CardContainer from '../components/CardContainer';
import ExpertCard from '../components/ExpertCard';
import HeaderImage from '../components/HeaderImage';
import NewsletterSignUp from '../components/NewsletterSignUp';
import SocialMedia from '../components/SocialMedia';

const HomePage = () => {
  return (
    <>
      <HeaderImage className="m-5 p-5"></HeaderImage>
      <Header as="h1">Featured Experts</Header>
      {/* <CardContainer></CardContainer> */}
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
