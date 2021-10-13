import React from 'react';
import { Card, Icon, Image, Rating } from 'semantic-ui-react';

const ExpertCard = ({ firstName, lastName, description, rating, imgURL }) => {
  return (
    <Card className="bg-light">
      <Image
        src={imgURL ? imgURL : "https://i.pravatar.cc/300"}
        className="px-5"
        ui={false}
      />
      <Card.Content>
        <Card.Header>
          {firstName} {lastName}
        </Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Rating icon="star" defaultRating={rating} maxRating={5} disabled />
      </Card.Content>
    </Card>
  );
};

export default ExpertCard;
