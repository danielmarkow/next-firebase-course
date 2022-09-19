import {useState} from "react";

import {firestore, postToJson, fromMillis} from "../lib/firebase";
import {collectionGroup, query, where, orderBy, limit, getDocs, startAfter} from "firebase/firestore";

import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";

const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsRef = collectionGroup(firestore, "posts");
  const postsQuery = query(postsRef, where("published", "==", true), orderBy("createdAt", "desc"), limit(LIMIT));
  const res = await getDocs(postsQuery);

  const posts = [];
  res.forEach((doc) => {posts.push(postToJson(doc))});

  return {
    props: {posts}
  }
};

function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);
  console.log("Home", props)
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === "number" ? fromMillis(last.createdAt) : last.createdAt;

    const postsRef = collectionGroup(firestore, "posts");
    const postQuery = query(postsRef, where("published", "==", true), orderBy("createdAt", "desc"), startAfter(cursor), limit(LIMIT));
    const res = await getDocs(postQuery);

    const newPosts = [];
    res.forEach((doc) => {newPosts.push(doc)});

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if(newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && <button onClick={getMorePosts}>Load More</button>}
      <Loader show={loading} />
      {postsEnd && "You have reached the end!"}
    </main>
  )
}

 export default Home;