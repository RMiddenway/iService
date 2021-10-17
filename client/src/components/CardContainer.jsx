import { Card } from 'semantic-ui-react';

import ExpertCard from './ExpertCard';
import TaskCard from './TaskCard';

const CardContainer = ({
  cardType,
  cards,
  handleHideTask,
  handleClick,
  highlightedId,
}) => {
  const getTaskCard = (card) => {
    return (
      <TaskCard
        key={card._id}
        taskId={card._id}
        title={card.taskTitle}
        description={card.taskDescription}
        suburb={card.suburb}
        date={card.taskDate?.substring(0, 10)}
        handleHideTask={handleHideTask}
        handleClick={handleClick}
        isHighlighted={card._id === highlightedId ? true : false}
      />
    );
  };

  const getExpertCard = (card) => {
    return (
      <ExpertCard
        key={card._id}
        firstName={card.firstName}
        lastName={card.lastName}
        description={card.bio}
        rating={card.rating}
      />
    );
  };

  return (
    <>
      {cards.length === 0 ? (
        <div className="m-5">No {cardType} found</div>
      ) : (
        <Card.Group centered className="overflow-auto h-100">
          {cards.map((card) => {
            if (cardType === "task") return getTaskCard(card);
            else if (cardType === "expert") return getExpertCard(card);
            else return <></>;
          })}
        </Card.Group>
      )}
    </>
  );
};

export default CardContainer;
