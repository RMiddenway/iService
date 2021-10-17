import CurrencyInput from './CurrencyInput';
import DateInput from './DateInput';
import ImageUpload from './ImageUpload';
import LocationInput from './LocationInput';
import RadioButtonGroup from './RadioButtonGroup';
import SectionHeader from './SectionHeader';
import TextInput from './TextInput';

const FormSection = (props) => {
  return (
    <>
      {props.field.type === "header" ? (
        <SectionHeader label={props.field.label}></SectionHeader>
      ) : (
        ""
      )}
      {props.field.type === "text" ? (
        <TextInput
          label={props.field.label}
          inputKey={props.field.inputKey}
          rows={props.field.rows}
          placeholder={props.field.placeholder}
          onChange={props.onChange}
        ></TextInput>
      ) : (
        ""
      )}
      {props.field.type === "date" ? (
        <DateInput
          label={props.field.label}
          inputKey={props.field.inputKey}
          onChange={props.onChange}
        ></DateInput>
      ) : (
        ""
      )}
      {props.field.type === "currency" ? (
        <CurrencyInput
          label={props.field.label}
          inputKey={props.field.inputKey}
          onChange={props.onChange}
        ></CurrencyInput>
      ) : (
        ""
      )}
      {props.field.type === "radioButtonGroup" ? (
        <RadioButtonGroup
          label={props.field.label}
          buttonLabels={props.field.buttonLabels}
          inputKey={props.field.inputKey}
          onChange={props.onChange}
          defaultValue={props.field.defaultValue}
        ></RadioButtonGroup>
      ) : (
        ""
      )}
      {props.field.type === "imageUpload" ? (
        <ImageUpload
          label={props.field.label}
          inputKey={props.field.inputKey}
          onChange={props.onChange}
        ></ImageUpload>
      ) : (
        ""
      )}
      {props.field.type === "location" ? (
        <LocationInput
          // label={props.field.label}
          // inputKey={props.field.inputKey}
          onChange={props.onChange}
        ></LocationInput>
      ) : (
        ""
      )}
    </>
  );
};

export default FormSection;
