import styles from '../../styles/Admin.module.css';
import AuthCheck from "../../components/AuthCheck";
import {auth, firestore} from "../../lib/firebase";
import {serverTimestamp, collectionGroup, setDoc, query, where, orderBy, doc, getDocs} from 'firebase/firestore';
import {useCollection} from "react-firebase-hooks/firestore";

import PostFeed from "../../components/PostFeed";

import toast from "react-hot-toast";
import {useRouter} from "next/router";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../lib/context";
import kebabCase from "lodash.kebabcase";

function AdminPostsPage() {
    return (
    <main>
        <AuthCheck>
            <PostList />
            <CreateNewPost />
        </AuthCheck>
    </main>
    );
};

function PostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            const ref = collectionGroup(firestore, "posts");
            const q = query(ref, where("uid", "==", auth.currentUser.uid), orderBy("createdAt"));
            const res = await getDocs(q);

            const posts = res?.docs.map((doc) => doc.data());
            setPosts(posts);
        }
        getPosts().catch((err) => toast.error(`Error retrieving posts: ${err}`));
    }, []);


    // const posts = getPosts();
    // console.log(posts);

    return (
        <>
            <h1>Manage your Posts</h1>
            <PostFeed posts={posts} admin />
        </>
    )
};

function CreateNewPost() {
    const router = useRouter();
    const {username} = useContext(UserContext);
    const [title, setTitle] = useState("");

    const slug = encodeURI(kebabCase(title));

    const isValid = title.length > 3 && title.length < 100;

    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(firestore, "users", uid, "posts", slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };

        await setDoc(ref, data).then(() => {
            toast.success("Post Created");
            router.push(`/admin/${slug}`);
        }).catch((err) => {
            toast.error(`Error creating post: ${err}`);
        });

    };

    return (
        <form onSubmit={createPost} >
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Article"
                className={styles.input}
            />
            <p>
                <strong>Slug:</strong>{slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">Create New Post</button>
        </form>
    );

};

export default AdminPostsPage;