import { Header } from 'semantic-ui-react';

const SectionHeader = (props) => {
  return (
    <>
      <Header as="h3" className="px-3 py-2 bg-secondary text-light">
        {props.label}
      </Header>
    </>
  );
};

export default SectionHeader;
