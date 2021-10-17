import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Button } from 'semantic-ui-react';

const SignUp = () => {
  const { addToast } = useToasts();
  const history = useHistory();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "user",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    fetch("/api/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        addToast("Signed Up Successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
        history.push(data);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const checkFormValid = () => {
    // todo - add better form validation
    return form.password === form.confirmPassword;
  };

  return (
    <>
      <form id="form" onSubmit={(e) => submit(e)}>
        <div className="d-flex justify-content-center">
          <div className="form col-6">
            <div className="row">
              <h2 className="mb-4 text-teal">
                Sign up for an iService account
              </h2>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label for="firstName">First name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <div className="col">
                <label for="lastName">Last name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label for="email">Email*</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label for="password">Password*</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label for="confirmpassword">Confirm Password*</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
            </div>

            <p
              className="mb-3 text-danger"
              style={{ whiteSpace: "pre-line" }}
              id="error-text"
            ></p>
            <div className="d-flex justify-content-center">
              <Button
                disabled={!checkFormValid()}
                color="teal"
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
                Create Account
              </Button>
            </div>
            <p onClick={(e) => history.push("/signin")}>
              Already have an account? Sign in!
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default SignUp;
