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
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                <h5>Humedad: {item.humedad}</h5>
                <h5>Temperatura: {item.temperatura}</h5>
                <h5>Fototransitor: {item.fototransistor}</h5>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Home;
