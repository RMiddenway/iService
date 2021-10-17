import { useEffect, useState } from "react";
import { Header, Modal, Button, Image } from "semantic-ui-react";

import CardContainer from "../components/CardContainer";
import Checkout from "../components/Checkout";

const MyTasks = () => {
  const userId = localStorage.getItem("USER_ID");
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState();

  const getTasks = () => {
    const queryParams = new URLSearchParams({ postedBy: userId }).toString();
    console.log("====================================");
    console.log(queryParams);
    console.log("====================================");
    fetch(`http://localhost:5100/api/task?${queryParams}`, {
      method: "get",
      // body: JSON.stringify({ userId: userId }),
    })
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((err) => {
        console.log("Error", err);
      });
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleClick = async (taskId) => {
    const task = tasks.filter((t) => t._id === taskId)[0];
    await fetch(
      `http://localhost:5100/api/getimage?imageId=${task?.taskImageId}`,
      {
        method: "get",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setActiveTask({ ...task, taskImage: data.base64 });
        setModalOpen(!modalOpen);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };
  const handleNullClick = () => {};

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="container">
          <div className="row mb-3">
            <div className=" col">
              <Header as="h2">Active Tasks</Header>
              <CardContainer
                cardType="task"
                cards={tasks.filter((task) => task.status === "open")}
                // handleHideTask={handleHideTask}
                handleClick={handleNullClick}
              ></CardContainer>
            </div>
          </div>
          <div className="row mb-3">
            <div className=" col">
              <Header as="h2">Ongoing Tasks</Header>
              <CardContainer
                cardType="task"
                cards={tasks.filter((task) => task.status === "accepted")}
                // handleHideTask={handleHideTask}
                handleClick={handleNullClick}
              ></CardContainer>
            </div>
          </div>
          <div className="row mb-3">
            <div className=" col">
              <Header as="h2">Tasks Awaiting Payment</Header>
              <CardContainer
                cardType="task"
                cards={tasks.filter((task) => task.status === "completed")}
                // handleHideTask={handleHideTask}
                handleClick={handleClick}
              ></CardContainer>
            </div>
          </div>
        </div>
        <Modal
          closeIcon
          onClose={() => setModalOpen(false)}
          size="small"
          open={modalOpen}
          style={{ height: "auto", position: "static" }}
        >
          <Modal.Header className="d-flex justify-content-between">
            <h1>{activeTask?.taskTitle}</h1>
          </Modal.Header>
          <Modal.Content>
            <div className="d-flex justify-content-between">
              <div>{activeTask?.taskType}</div>
              <div>{activeTask?.suburb}</div>
              <div>
                ${activeTask?.budgetValue}
                {activeTask?.budgetType === "Hourly rate" ? "/hr" : " total"}
              </div>
            </div>
          </Modal.Content>
          <Modal.Content image className="container">
            <Modal.Description className="col-6">
              <p>{activeTask?.taskDescription}</p>
            </Modal.Description>
            <Image
              size="medium"
              src={activeTask?.taskImage}
              wrapped
              className="col-6"
            />
          </Modal.Content>
          <div className="d-flex justify-content-end mx-4">
            <label for="finalCost">Final Cost: ${activeTask?.finalCost}</label>
          </div>

          <Modal.Actions className="mb-2">
            <div className="d-flex justify-content-end">
              <Checkout
                cost={activeTask?.finalCost}
                title={activeTask?.taskTitle}
              />

              {/* <Button color="green" onClick={(e) => handleSubmit(e)}>
                Mark as Completed
              </Button> */}
            </div>
          </Modal.Actions>
        </Modal>
      </div>
    </>
  );
};

export default MyTasks;
