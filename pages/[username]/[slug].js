import styles from '/styles/Post.module.css';

import {firestore, postToJson} from "../../lib/firebase";
import {collectionGroup, query, getDocs, where, onSnapshot} from "firebase/firestore";
import PostContent from "../../components/PostContent";

export async function getStaticProps({params}) {
    const {username, slug} = params;

    let post;
    let path;

    const postsRef = collectionGroup(firestore, "posts");
    const q = query(postsRef, where("username", "==", username), where("slug", "==", slug));
    path = null;
    console.log(q.path)
    const res = await getDocs(q);

    post = postToJson(res.docs[0]);

    return {
        props: {post, path},
        revalidate: 5000,
    }
};

export async function getStaticPaths() {
    const postsRef = collectionGroup(firestore, "posts");
    const res = await getDocs(postsRef);

    const paths = res.docs.map((doc) => {
        const {username, slug} = doc.data();
        return {
            params: {username, slug},
        };
    });

    return {
        paths,
        fallback: "blocking",
    };
}


function Post(props) {
    let post = props.post;
    // TODO implement realtime hydration

    return (
    <main className={styles.container}>
        <section>
            <PostContent post={post} />
        </section>

        <aside className="card">
            <p>
                <strong>{post.heartCount || 0} Heart</strong>
            </p>
        </aside>
    </main>
    );
};

export default Post;