import { Card } from "semantic-ui-react";

const TaskCard = ({
  title,
  description,
  suburb,
  date,
  taskId,
  handleClick,
}) => {
  return (
    <Card className="bg-light" raised onClick={(e) => handleClick(taskId)}>
      <Card.Content>
        <div>
          <Card.Header as="h3">{title}</Card.Header>
        </div>
      </Card.Content>
      <Card.Content>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="d-flex justify-content-between">
          <div>{suburb}</div>
          <div>{date}</div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default TaskCard;
