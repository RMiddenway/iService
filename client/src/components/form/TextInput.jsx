import { TextArea } from 'semantic-ui-react';

const TextInput = (props) => {
  // todo - use input component if !rows or rows === 1
  return (
    <div className="px-3 mb-3 d-flex justify-content-left">
      <div className="col-2">{props.label}</div>
      <TextArea
        type="text"
        rows={props.rows || 1}
        placeholder={props.placeholder}
        className="col-6 p-2"
        onChange={(e) => props.onChange(props.inputKey, e)}
      ></TextArea>
    </div>
  );
};

export default TextInput;
