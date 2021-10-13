import { Card, Confirm } from "semantic-ui-react";

import ExpertCard from "./ExpertCard";
import TaskCard from "./TaskCard";

const CardContainer = ({ cardType, cards, handleHideTask, handleClick }) => {
  const placeholderExperts = [
    {
      key: 0,
      imgURL: "https://i.pravatar.cc/300?img=1",
      firstName: "Crom",
      lastName: "Tuise",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rating: 3,
    },
    {
      key: 1,
      imgURL: "https://i.pravatar.cc/300?img=2",
      firstName: "Mill",
      lastName: "Burray",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rating: 4,
    },
    {
      key: 2,
      imgURL: "https://i.pravatar.cc/300?img=3",
      firstName: "Donny",
      lastName: "Jepp",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rating: 2,
    },
    {
      key: 3,
      imgURL: "https://i.pravatar.cc/300?img=4",
      firstName: "Breff",
      lastName: "Jidges",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rating: 4,
    },
    {
      key: 4,
      imgURL: "https://i.pravatar.cc/300?img=5",
      firstName: "Jarlett",
      lastName: "Scohanssen",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rating: 5,
    },
  ];
  // console.log(cards);
  return (
    <Card.Group centered>
      {cards.map((card) => {
        return cardType === "task" ? (
          <TaskCard
            key={card._id}
            taskId={card._id}
            title={card.taskTitle}
            description={card.taskDescription}
            suburb={card.suburb}
            date={card.taskDate?.substring(0, 10)}
            handleHideTask={handleHideTask}
            handleClick={handleClick}
          />
        ) : (
          <></>
        );
      })}
    </Card.Group>
  );
};

export default CardContainer;
