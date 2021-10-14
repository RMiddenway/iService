import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router-dom";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { addToast } = useToasts();
  const history = useHistory();
  // const handleSignUpClick = (e) => {
  //   history.push("/signup");
  // };
  const onChange = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5100/signin", {
      method: "post",
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        addToast("Logged In Successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
        localStorage.setItem("IS_SIGNED_IN", "true");
        history.push(data);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="form col-4">
          <div className="card">
            <article className="card-body">
              <h2 className="text-center text-teal">iService</h2>
              <h5 className="card-title text-center mb-4 mt-1">Sign in</h5>
              <hr />
              <form id="form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group mb-2">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fa fa-user fa-fw py-1"></i>
                      </span>
                    </div>
                    <input
                      name="email"
                      className="form-control"
                      placeholder="Email"
                      type="email"
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                  {/* <!-- input-group.// --> */}
                </div>
                {/* <!-- form-group// --> */}
                <div className="form-group mb-2">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fa fa-lock fa-fw py-1"></i>
                      </span>
                    </div>
                    <input
                      name="password"
                      className="form-control"
                      placeholder="******"
                      type="password"
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                  {/* <!-- input-group.// --> */}
                </div>
                {/* <!-- form-group// --> */}
                <p
                  className="mb-3 text-danger"
                  style={{ whiteSpace: "pre-line" }}
                  id="error-text"
                ></p>
                <div className="row center">
                  <label>
                    <input
                      name="remember"
                      type="checkbox"
                      className="form-control"
                    />
                    <span>Remember Me</span>
                  </label>
                </div>
                <div className="form-group row">
                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      className="
                      btn btn-primary
                      mb-3
                      px-4\
                      d-flex
                      justify-content-center
                      button-teal
                    "
                    >
                      Login
                    </button>
                  </div>
                </div>
                {/* <!-- form-group// --> */}
                <p className="text-center">
                  <a href="/signup" className="btn">
                    Don't have an account? Sign up!
                  </a>
                </p>
              </form>
            </article>
            <div className="col s12 m6 offset-m3 center-align">
              <a
                className="oauth-container btn darken-4 white black-text"
                href="/auth/google"
                style={{ textTransform: "none" }}
              >
                <div className="left">
                  <img
                    width="20px"
                    style={{ marginTop: "7px; margin-right: 8px" }}
                    alt="Google sign-in"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                  />
                </div>
                Sign in with Google
              </a>
            </div>
          </div>
          {/* <!-- card.// --> */}
        </div>
      </div>
    </>
  );
};

export default SignIn;
