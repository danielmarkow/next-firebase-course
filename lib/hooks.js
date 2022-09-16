import {useState, useEffect} from "react";

import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "./firebase";
import {doc, onSnapshot} from "firebase/firestore";

export function useUserData() {
  const [user] = useAuthState(auth);
  // console.log("user inside hook: ", user);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      unsubscribe = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
        setUsername(doc.data()?.username);
      })
    } else {
      setUsername(null);
    }
    return unsubscribe;
  }, [user]);
  return {user, username};
}