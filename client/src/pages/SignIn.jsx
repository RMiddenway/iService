import { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Button, Icon } from 'semantic-ui-react';

import { setSignedIn, setUserType } from '../auth/authSlice';

const SignIn = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const { addToast } = useToasts();
  const history = useHistory();
  const onChange = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    fetch("/api/signin", {
      method: "post",
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        addToast("Logged In Successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
        dispatch(setSignedIn(data._id));
        dispatch(setUserType(data.userType));
        history.push("/");
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const handleLogin = async (googleData) => {
    const res = await fetch("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
    addToast("Logged In Successfully!", {
      appearance: "success",
      autoDismiss: true,
    });
    dispatch(setSignedIn(data._id));
    if (data.userType) {
      dispatch(setUserType(data.userType));
    }

    history.push("/");
    // store returned user somehow
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="form col-6">
          <div className="card">
            <article className="card-body">
              <h2 className="text-center text-teal">
                <Icon name="cog" color="teal" />
                iService
              </h2>
              <h5 className="card-title text-center mb-4 mt-1">Sign in</h5>
              <hr />
              <form id="form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group mb-2">
                  <div className="input-group">
                    <input
                      name="email"
                      className="form-control"
                      placeholder="Email"
                      type="email"
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                </div>
                <div className="form-group mb-2">
                  <div className="input-group">
                    <input
                      name="password"
                      className="form-control"
                      placeholder="******"
                      type="password"
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                </div>
                <p
                  className="mb-3 text-danger"
                  style={{ whiteSpace: "pre-line" }}
                  id="error-text"
                ></p>

                <div className="form-group row">
                  <div className="d-flex justify-content-center">
                    <Button
                      type="submit"
                      color="teal"
                      className="
                      btn btn-primary
                      mb-3
                      px-4
                      d-flex
                      justify-content-center
                      button-teal
                    "
                    >
                      Sign In
                    </Button>
                  </div>
                </div>
                <p
                  className="text-center"
                  onClick={(e) => {
                    history.push("/signup");
                  }}
                >
                  Don't have an account? Sign up!
                </p>
              </form>
            </article>
            <GoogleLogin
              className="justify-content-center"
              clientId={
                "304926904443-4altq1dv50t5hciuvstp3hlv1lm0d6fk.apps.googleusercontent.com"
              }
              buttonText="Sign in with Google"
              onSuccess={handleLogin}
              onFailure={handleLogin}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
