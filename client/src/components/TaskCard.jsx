import { Card } from 'semantic-ui-react';

const TaskCard = ({
  title,
  description,
  suburb,
  date,
  taskId,
  handleClick,
  isHighlighted,
}) => {
  return (
    <Card
      className={isHighlighted ? "bg-white" : "bg-light"}
      raised
      onClick={(e) => handleClick(taskId)}
    >
      <Card.Content>
        <div>
          <Card.Header
            // as="h3"
            className={isHighlighted ? "font-weight-bold color-teal" : ""}
          >
            {title}
          </Card.Header>
        </div>
      </Card.Content>
      <Card.Content>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="d-flex justify-content-between">
          <div>{suburb || "Online"}</div>
          <div>{date}</div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default TaskCard;
