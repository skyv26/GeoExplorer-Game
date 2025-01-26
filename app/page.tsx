import Link from "next/link";

const Home = () => <main>
    <ul>
        <li>
            Easy
        </li>
        <li>
            Medium
        </li>
        <li>
            Hard
        </li>
    </ul>
    <Link href="/game">Start Game</Link>
</main>

export default Home;