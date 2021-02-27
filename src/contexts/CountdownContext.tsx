import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengeContext";

interface CountdownContextDate {
  minutes: number;
  seconds: number;
  hasFinished: boolean;
  isActive: boolean;
  startCountdown: () => void;
  resetCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextDate);

let countdownTimeout: NodeJS.Timeout; // vais ervir pra cancelar a execucao do ultimo timeout depois do clique no potao de parar

export function CountdownProvider({children}: CountdownProviderProps){
  const { startNewChallenge } = useContext(ChallengesContext);
  const [time, setTime] = useState(0.1 * 60); // minutos*60segundos 
  const [isActive, setIsActive]= useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes =Math.floor(time/60);
  const seconds =time%60;

  useEffect(() => {
    if (isActive && time > 0) {
     countdownTimeout =  setTimeout(() => {
        setTime(time - 1)
      }, 1000); //Repete a casa mil milissegundos
    } else if (isActive && time === 0){
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time]); //Essa função é chamada sempre que active ou time mudar
 
  function startCountdown(){
    
    setIsActive(true);
  }

  function resetCountdown(){
    clearTimeout(countdownTimeout);
    setIsActive(false);
    
    setHasFinished(false);
    setTime(0.1 * 60);

    
  }

  
  return (
    <CountdownContext.Provider value= {{
      minutes,
      seconds,
      hasFinished,
      isActive,
      startCountdown,
      resetCountdown,
    }}
    >
      {children}
    </CountdownContext.Provider>
  )
}