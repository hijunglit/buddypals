import { useEffect } from "react";

function Home() {
  useEffect(() => {
    const getData = fetch(`http://localhost:5050/`);
  }, []);
  return <h1>Home</h1>;
}
export default Home;
