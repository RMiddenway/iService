import { Header, Icon } from 'semantic-ui-react';

const SocialMedia = () => {
  return (
    <>
      <Header as="h3">Connect with us!</Header>
      <a href="http://www.facebook.com">
        <Icon name="facebook" size="big" color="blue" />
      </a>
      <a href="http://www.twitter.com">
        <Icon name="twitter" size="big" color="blue" />
      </a>
      <a href="http://www.instagram.com">
        <Icon name="instagram" size="big" color="pink" />
      </a>
    </>
  );
};

export default SocialMedia;
