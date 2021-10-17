const RadioButtonGroup = (props) => {
  const handleChange = (e) => {
    if (e.target.checked) {
      props.onChange({ [props.inputKey]: e.target.value });
    }
  };

  return (
    <div className="px-3 my-2 d-flex justify-content-left">
      <div className="col-2">{props.label}</div>
      {props.buttonLabels.map((label) => (
        <div key={label}>
          <input
            checked={props.defaultValue === label ? "checked" : undefined}
            type="radio"
            id={label}
            name={props.inputKey}
            value={label}
            className="me-1"
            onChange={handleChange}
          ></input>
          <label htmlFor={label} className="me-5">
            {label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioButtonGroup;
