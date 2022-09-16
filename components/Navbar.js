import Link from "next/link";
import {useContext} from "react";
import {UserContext} from "../lib/context";
import SignOutButton from "./SignOutButton";

function Navbar() {
    const {user, username} = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button>FEED</button>
                    </Link>
                </li>
                {/*user is signed in and has a username*/}
                {username && (
                    <>
                        <li className="push-left">
                            <Link href="/admin">
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <SignOutButton />
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL} />
                            </Link>
                        </li>
                    </>
                )}
                {/*user is not signed in and has not username*/}
                {!username && (
                    <li>
                        <Link href="/enter">
                            <button className="btn-blue">Log In</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;