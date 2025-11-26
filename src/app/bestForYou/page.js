"use client"
import MenuButton from "@/components/TopBar/MenuButton";
import kunta_stat from "../../app/kunta_vaki2024.json";
import { preProcessData } from "@/utlis/dataPreProcessor";

export default function Home() {

  const parameter = "he_miehet";

  const preProcessedData = {
            ...kunta_stat,
            features: preProcessData(kunta_stat.features, parameter)
        }

  console.log(preProcessedData);


  const largest = {
    largest: Number.MIN_VALUE,
    municipality: ""
  }

  for (let feature of preProcessedData.features) {
    if (feature.properties[parameter] > largest.largest) {
      largest.largest = feature.properties[parameter];
      largest.municipality = feature.properties;
    }
  }



  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <MenuButton />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <p>Tähän tulee toteutus siitä mikä kunta on sinulle paras</p>
        <div>
          <form>
            <label>
              Miesten määrä: 
              <input type="checkbox"></input>
            </label>
          </form>
        </div>
        <div>
          <p>{largest.municipality.nimi}, {largest.largest}</p>
        </div>
      </main>
    </div>
  );
}
