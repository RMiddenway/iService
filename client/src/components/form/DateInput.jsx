const DateInput = (props) => {
  return (
    <div className="px-3 d-flex justify-content-left">
      <div className="col-2">{props.label}</div>
      <input
        type="date"
        class="col-3"
        onChange={(e) => props.onChange(props.inputKey, e)}
      ></input>
    </div>
  );
};

export default DateInput;
