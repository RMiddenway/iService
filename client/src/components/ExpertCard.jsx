import React from 'react';
import { Card, Icon, Image, Rating, Reveal } from 'semantic-ui-react';

const ExpertCard = ({ firstName, lastName, description, rating, imgURL }) => {
  return (
    <>
      <Reveal animated="fade">
        <Reveal.Content visible></Reveal.Content>
        <Reveal.Content hidden>
          <Card className="bg-light">
            <Image
              src={imgURL ? imgURL : "https://i.pravatar.cc/300?sig=123"}
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
              <Rating
                icon="star"
                defaultRating={rating}
                maxRating={5}
                disabled
              />
            </Card.Content>
          </Card>
        </Reveal.Content>
      </Reveal>
    </>
  );
};

export default ExpertCard;
