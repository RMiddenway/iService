import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Button, Container } from "semantic-ui-react";

import FormSection from "../components/form/FormSection";
import LocationInput from "../components/form/LocationInput";

// import PlacesInput from '../components/form/PlacesInput';

const TaskForm = () => {
  const initialForm = {
    taskType: "In person",
    taskTitle: "",
    taskDescription: "",
    suburb: "",
    lat: "",
    lng: "",
    taskDate: "",
    budgetType: "Total",
    budgetValue: "",
    taskImageId: "",
    userId: localStorage.getItem("USER_ID"),
  };
  const [form, setForm] = useState(initialForm);
  const { addToast } = useToasts();
  const history = useHistory();

  const initialFields = [
    { key: "field1", type: "header", label: "New Task" },
    {
      key: "field2",
      type: "radioButtonGroup",
      label: "Select Task Type: ",
      inputKey: "taskType",
      buttonLabels: ["In person", "Online"],
      defaultValue: form.taskType,
    },
    { key: "field3", type: "header", label: "Describe your task to Experts" },
    {
      key: "field4",
      type: "text",
      label: "Task Title: ",
      inputKey: "taskTitle",
      placeholder: "Give your task a short but descriptive name",
    },
    {
      key: "field5",
      type: "text",
      label: "Description: ",
      inputKey: "taskDescription",
      placeholder: "Describe your task clearly",
      rows: "6",
    },
    {
      key: "field6",
      type: "imageUpload",
      label: "Add your image: ",
      inputKey: "taskImageId",
    },
    { key: "field7", type: "header", label: "Setting up your Task" },
    // form.taskType === "In person"
    form.taskType === "In person" ? { type: "location" } : "",
    { key: "field8", type: "date", label: "Date: ", inputKey: "taskDate" },
    { key: "field9", type: "header", label: "Suggest how much" },
    {
      key: "field10",
      type: "radioButtonGroup",
      label: "What is your budget?",
      inputKey: "budgetType",
      buttonLabels: ["Total", "Hourly rate"],
      defaultValue: form.budgetType,
    },
    { key: "field11", type: "currency", inputKey: "budgetValue" },
  ];
  useEffect(() => {
    setFields(initialFields);
  }, [form]);

  const [fields, setFields] = useState(initialFields);

  // const onChange = (inputKey, e) => {
  // setForm({ ...form, [inputKey]: e.target.value });
  const onChange = (input) => {
    setForm({ ...form, ...input });
  };
  const submitForm = (e) => {
    fetch("http://localhost:5100/api/task", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        console.log(response);
        addToast("Task Added Successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
        history.push("/");
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  return (
    <Container>
      {/* <LocationInput></LocationInput> */}
      {fields.map((field) => (
        <FormSection
          field={field}
          onChange={onChange}
          key={field.key}
        ></FormSection>
      ))}
      {/* todo - form validation, disable Post Task button if not valid */}
      <Button primary className="my-3 ms-3" onClick={submitForm}>
        Post Task
      </Button>
    </Container>
  );
};
export default TaskForm;
