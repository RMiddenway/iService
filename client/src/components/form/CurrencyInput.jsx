const CurrencyInput = (props) => {
  return (
    <div className="px-3 my-3 d-flex justify-content-left">
      $
      <input
        type="number"
        min="1"
        step="any"
        onChange={(e) => props.onChange(props.inputKey, e)}
      ></input>
    </div>
  );
};

export default CurrencyInput;
