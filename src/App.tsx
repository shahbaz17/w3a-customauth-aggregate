import { useEffect, useState } from "react";
import "./App.css";

import DirectWebSdk from "@toruslabs/customauth";

function App() {
  const [torus, setTorus] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const jwtParams = {
    domain: "https://shahbaz-torus.us.auth0.com", // eg: "https://torus-test.auth0.com"
  };

  const subVerifierDetailsGoogle = {
    typeOfLogin: "google",
    verifier: "w3a-google",
    clientId: "774338308167-q463s7kpvja16l4l0kko3nb925ikds2p.apps.googleusercontent.com",
  };

  const subVerifierDetailsGithub = {
    typeOfLogin: "jwt",
    verifier: "w3a-github",
    // auth0 application client id
    clientId: "294QRkchfq2YaXUbPri7D6PH7xzHgQMT",
    jwtParams: {
      ...jwtParams,
      // this corresponds to the field inside jwt which must be used to uniquely
      // identify the user. This is mapped b/w google and github logins
      verifierIdField: "email",
      isVerifierIdCaseSensitive: false,
    },
  };

  const commonVerifierIdentifier = "w3a-google-github";

  useEffect(() => {
    const init = async () => {
      try {
        const torus = new DirectWebSdk({
          baseUrl: "http://localhost:3000/serviceworker/",
          network: "testnet",
        });
        await torus.init();
        setTorus(torus)
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const loginGoogle = async () => {
    if (!torus) {
      uiConsole("torus not initialized yet");
      return;
    }
    const loginDetails = await torus.triggerAggregateLogin({
      aggregateVerifierType: "single_id_verifier",
      verifierIdentifier: commonVerifierIdentifier,
      subVerifierDetailsArray: [subVerifierDetailsGoogle],
    });
    console.log(loginDetails)
    setUser(loginDetails)
  }

  const loginGithub = async () => {
    if (!torus) {
      uiConsole("torus not initialized yet");
      return;
    }
    const loginDetails = await torus.triggerAggregateLogin({
      aggregateVerifierType: "single_id_verifier",
      verifierIdentifier: commonVerifierIdentifier,
      subVerifierDetailsArray: [subVerifierDetailsGithub],
    });
    console.log(loginDetails)
    setUser(loginDetails)
  }

  const getUserInfo = async () => {
    if (!torus) {
      uiConsole("torus not initialized yet");
      return;
    }
    // const user = await torus.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!torus) {
      uiConsole("torus not initialized yet");
      return;
    }
    setUser(null);
  };

  // const getAccounts = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const userAccount = await rpc.getAccounts();
  //   uiConsole(userAccount);
  // };

  // const getBalance = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const balance = await rpc.getBalance();
  //   uiConsole(balance);
  // };

  // const signMessage = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const result = await rpc.signMessage();
  //   uiConsole(result);
  // };

  // const sendTransaction = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const result = await rpc.sendTransaction();
  //   uiConsole(result);
  // };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loginView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        {/* <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div> */}
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Login Successful</p>
      </div>
    </>
  );

  const logoutView = (
    <>
    <button onClick={loginGoogle} className="card">
      Login using Google
    </button>
    <button onClick={loginGithub} className="card">
      Login using Auth0 (Google)
    </button>
    </>
    
  );

  return (
    <div className="container">
      <h1 className="title">
        CustomAuth - [Google-Auth0] Aggregate Verifier React Example
      </h1>

      <div className="grid">{user ? loginView : logoutView}</div>

      <footer className="footer">
        <a
          href="https://github.com/shahbaz17/w3a-customauth-aggregate"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
