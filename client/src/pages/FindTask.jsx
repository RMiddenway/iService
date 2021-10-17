import { useEffect, useState } from 'react';
import { Button, Form, Grid, Image, Input, Modal } from 'semantic-ui-react';

import CardContainer from '../components/CardContainer';
import TaskMap from '../components/TaskMap';

const FindTask = () => {
  const userId = localStorage.getItem("USER_ID");
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: "open" });
  const [activeTask, setActiveTask] = useState();
  const [highlightedTaskId, setHighlightedTaskId] = useState();

  const onChange = (label, e) => {
    if (e.target.value === "") {
    }
    setFilters({ ...filters, [label]: e.target.value });
    // todo ----- add tasks to expert area, add task form for final cost and complete
    // todo - --- add payment area for completed tasks
  };

  const applyFilters = () => {
    getTasks(new URLSearchParams(filters).toString());
  };
  const clearFilters = () => {
    setFilters({ status: "open" });
    getTasks();
  };

  const getTasks = (queryParams) => {
    fetch(`/api/task?${queryParams}&${userId}`, {
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

  const [modalOpen, setModalOpen] = useState(false);

  const handleHideTask = (taskId) => {
    fetch("/api/hidetask", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId: taskId, userId: userId }),
    })
      .then((response) => {
        if (response.status === 200) {
          getTasks();
          setModalOpen(false);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const handleClick = async (taskId) => {
    const task = tasks.filter((t) => t._id === taskId)[0];
    await fetch(`/api/getimage?imageId=${task?.taskImageId}`, {
      method: "get",
    })
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

  const handleAcceptTask = (e) => {
    fetch("/api/accepttask", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId: e._id, expertId: userId }),
    })
      .then((response) => {
        if (response.status === 200) {
          getTasks();
          setModalOpen(false);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const onMarkerMouseover = (taskId) => {
    console.log("====================================");
    console.log(taskId);
    console.log("====================================");
    setHighlightedTaskId(taskId);
  };
  const onMarkerMouseout = () => {
    setHighlightedTaskId("");
  };
  // const onMarkerClick = (taskId) => { };

  return (
    <>
      <Form>
        <Input
          type="text"
          placeholder="Keyword (eg. paint)"
          icon={{ name: "search", circular: true, link: true }}
          onChange={(e) => onChange("keywords", e)}
        ></Input>
        <Input type="date" onChange={(e) => onChange("taskDate", e)}></Input>
        <Input
          type="text"
          placeholder="Suburb"
          onChange={(e) => onChange("suburb", e)}
        ></Input>
        <Button type="button" onClick={applyFilters}>
          Filter
        </Button>
        <Button type="button" onClick={clearFilters}>
          Clear
        </Button>
      </Form>
      <div className="container m-2">
        <div className="row">
          <div className="col">
            <CardContainer
              cardType="task"
              cards={tasks}
              handleHideTask={handleHideTask}
              handleClick={handleClick}
              highlightedId={highlightedTaskId}
            ></CardContainer>
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
                    {activeTask?.budgetType === "Hourly rate"
                      ? "/hr"
                      : " total"}
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
              <Modal.Actions className="mb-2">
                <div className="d-flex justify-content-between">
                  <Button
                    color="red"
                    onClick={(e) => handleHideTask(activeTask._id)}
                  >
                    Hide Task
                  </Button>
                  <Button
                    color="green"
                    onClick={(e) => handleAcceptTask(activeTask)}
                  >
                    Accept Task
                  </Button>
                </div>
              </Modal.Actions>
            </Modal>
          </div>
          <div className="col">
            <TaskMap
              tasks={tasks}
              onMarkerClick={handleClick}
              onMarkerMouseover={onMarkerMouseover}
              onMarkerMouseout={onMarkerMouseout}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FindTask;
