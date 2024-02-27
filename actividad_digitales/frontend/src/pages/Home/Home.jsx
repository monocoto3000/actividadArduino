import React from "react";
import { useSocketData } from "../../hooks/useSocketData";

function Home() {
  const { data, isLoading } = useSocketData();
  if (isLoading || !data) {
    return <div>Cargando...</div>;
  }
  return (
    <div>
      <main>
        <section>
          <h2>Practica</h2>
          {data.map((item, index) => (
            <ul>
              <li key={index}>
                <h5><b>Humedad:</b> {item.humedad}</h5>
                <h5><b>Temperatura:</b> {item.temperatura}</h5>
                <h5><b>Fototransitor:</b> {item.fototransistor}</h5>
              </li>
            </ul>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Home;
