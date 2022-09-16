import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";

import {firestore, getUserWithUsername, postToJson} from "../../lib/firebase";
import {query as fbQuery, getDocs, where, orderBy, limit, collectionGroup} from "firebase/firestore";

export async function getServerSideProps({query}) {
    const {username} = query;

    const user = await getUserWithUsername(username);
    let posts = [];

    let usersRef = collectionGroup(firestore, "posts");
    let q = fbQuery(usersRef, where("username", "==", username), where("published", "==", true), orderBy("createdAt", "desc"), limit(5));
    let res = await getDocs(q);

    res.forEach((doc) => {posts.push(postToJson(doc))});


    return {
        props: {user, posts},
    }

}

function UserProfilePage({user, posts}) {

    return (
    <main>
        <UserProfile user={user}/>
        <PostFeed posts={posts}/>
    </main>
    );
}

export default UserProfilePage;