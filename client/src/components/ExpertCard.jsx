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
            src={
              imgURL
                ? imgURL
                : `https://picsum.photos/200/200?random=${firstName}`
            }
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
