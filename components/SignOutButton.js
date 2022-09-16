import {signOut} from "firebase/auth";
import {auth} from "../lib/firebase";

function SignOutButton() {
  return (
      <button className="btn-blue" onClick={() => signOut(auth)}>Sign Out</button>
  );
}

export default SignOutButton;