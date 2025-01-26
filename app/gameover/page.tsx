import Link from "next/link";

const GameOver = () => {
    return (
        <>
        <h2>Game Over</h2>
        <Link href="/leaderboard">See Leaderboard</Link>
        </>
    )
};

export default GameOver;