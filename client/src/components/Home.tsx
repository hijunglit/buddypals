import { useEffect, useState } from "react";

interface IData {
  text: string;
  hashtags: string;
}

function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = fetch(`http://localhost:5050`);
    const data = getData.then((response) => response.json());
    setData(data as any);
  }, []);
  console.log(data);
  return <h1>Home!</h1>;
}
export default Home;
