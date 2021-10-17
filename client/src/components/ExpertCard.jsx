import React, { useEffect, useState } from 'react';
import { Card, Image, Rating, Transition } from 'semantic-ui-react';

const ExpertCard = ({ firstName, lastName, description, rating, imgURL }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <>
      <Transition animation="pulse" duration={500} visible={visible}>
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
            <Rating icon="star" defaultRating={rating} maxRating={5} disabled />
          </Card.Content>
        </Card>
      </Transition>
    </>
  );
};

export default ExpertCard;
