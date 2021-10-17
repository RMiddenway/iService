import { Header, Image } from 'semantic-ui-react';

const HowItWorks = () => {
  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="col-10">
          <div className="row m-5">
            <Header as="h1" color="teal">
              iService, your helping hand
            </Header>
          </div>
          <div className="row m-2 my-5">
            <div className="col-6">
              <p>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua."
              </p>
            </div>
            <div className="col-6">
              <Image
                src="https://picsum.photos/300/300?random=1"
                className=""
                ui={false}
              />
            </div>
          </div>
          <div className="row m-2 my-5">
            <div className="col-6">
              <Image
                src="https://picsum.photos/300/300?random=2"
                className=""
                ui={false}
              />
            </div>
            <div className="col-6 end">
              <p>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua."
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
