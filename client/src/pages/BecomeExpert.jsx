import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import { setUserType } from "../auth/authSlice";

const BecomeExpert = () => {
  // const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("USER_ID");
  console.log(userId);
  // const isSignedIn = localStorage.getItem("IS_SIGNED_IN") === "true";
  const { addToast } = useToasts();
  const history = useHistory();
  const [form, setForm] = useState({
    country: "",
    addressFirst: "",
    addressSecond: "",
    city: "",
    region: "",
    postcode: "",
    phone: "",
    bio: "",
    userType: "expert",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    // console.log("====================================");
    // console.log(form);
    // console.log("====================================");
    e.preventDefault();

    // let headers = new Headers();
    // headers.append("Content-Type", "application/json");
    // headers.append("Access-Control-Allow-Origin", "http://localhost:3000");
    // headers.append("Access-Control-Allow-Credentials", "true");

    fetch(`/api/users/${userId}`, {
      method: "put",
      // headers: headers,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        addToast("Status changed to expert!", {
          appearance: "success",
          autoDismiss: true,
        });
        dispatch(setUserType("expert"));
        history.push("/");
      })
      .catch((err) => {
        console.log(userId);
        console.log("Error", err);
      });
  };

  const checkFormValid = () => {
    return true;
    // todo - add better form validation
    // return form.password === form.confirmPassword;
  };
  return (
    <>
      <form id="form" onSubmit={(e) => submit(e)}>
        <div className="d-flex justify-content-center">
          <div className="form col-6">
            <div className="row">
              <h2 className="mb-4 text-teal">Become an expert!</h2>
              <h5 className="mb-3 text-teal">
                We just need a few more details
              </h5>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label for="country">Country of residence*</label>
                <select
                  className="form-select"
                  name="country"
                  required
                  onChange={(e) => {
                    onChange(e);
                  }}
                >
                  <option selected>Choose from list</option>
                  <option value="AU">Australia</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label for="address">Address*</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="addressFirst"
                  onChange={(e) => onChange(e)}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  name="addressSecond"
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label for="city">City*</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <div className="col">
                <label for="region">State, Province or Region*</label>
                <input
                  type="text"
                  className="form-control"
                  name="region"
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label for="postcode">ZIP / Postal code</label>
                <input
                  type="text"
                  className="form-control"
                  name="postcode"
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label for="phone">Mobile phone number</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label for="phone">Bio</label>
                <textarea
                  type="text"
                  className="form-control"
                  rows={5}
                  name="bio"
                  onChange={(e) => onChange(e)}
                  placeholder="Write a brief description of your qualifications and what kind of work you're looking for."
                />
              </div>
            </div>
            <p
              className="mb-3 text-danger"
              style={{ whiteSpace: "pre-line" }}
              id="error-text"
            ></p>
            <div className="d-flex justify-content-center">
              <button
                disabled={!checkFormValid()}
                type="submit"
                className="
                btn btn-primary
                mb-3
                px-4
                d-flex
                justify-content-center
                button-teal
              "
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default BecomeExpert;
