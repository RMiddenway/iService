import { useState } from 'react';
import { Button } from 'semantic-ui-react';

const ImageUpload = (props) => {
  const [imagePost, setImagePost] = useState("");

  // Converts uploaded image to base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleUpload = async (e) => {
    const image = e.target.files[0];
    const imageBase64 = await convertToBase64(image);
    setImagePost(imageBase64);
    fetch("http://localhost:5100/upload", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ base64: imageBase64 }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Send uploaded image id to parent form
        props.onChange({ [props.inputKey]: data });
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  return (
    <div className="d-flex">
      <div className="col-2">{props.label}</div>
      <div className="col">
        <form>
          <input
            className="ms-2"
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={(e) => handleUpload(e)}
          ></input>
        </form>
      </div>
    </div>
  );
};

export default ImageUpload;
