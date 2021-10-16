const DateInput = (props) => {
  return (
    <div className="px-3 d-flex justify-content-left">
      <div className="col-2">{props.label}</div>
      <input
        type="date"
        className="col-3"
        onChange={(e) => props.onChange({ [props.inputKey]: e.target.value })}
      ></input>
    </div>
  );
};

export default DateInput;
