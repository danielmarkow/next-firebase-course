import Link from "next/link";

function Custom404() {
    return (
    <main>
      <h1>404 - That page does not seem to exist</h1>
      <Link href="/">
        <button className="btn-blue">Go Home</button>
      </Link>
    </main>
    );
}

export default Custom404;